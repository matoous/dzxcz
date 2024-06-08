use clap::{command, Parser};
use serde::Serialize;
use std::{
    collections::HashMap,
    fs::{self, File},
    io::Write,
    path::{Path, PathBuf},
    process,
};
use tempfile::tempdir;

#[derive(Debug, Clone, Default, Serialize)]
struct SrcSet {
    jpg512: String,
    jpg1024: String,
    jpg2048: String,
    webp512: String,
    webp1024: String,
    webp2048: String,
    original: String,
}

#[derive(Debug, Clone, Default, Serialize)]
struct PhotoParams {
    iso: String,
    focal_length: String,
    f_number: String,
    ev: String,
    exposure: String,
    model: String,
    make: String,
    srcset: SrcSet,
}

#[derive(Debug, Clone, Default, Serialize)]
struct Photo {
    title: String,
    date: String,
    params: PhotoParams,
}

#[derive(Parser, Debug, Clone)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long)]
    name: String,

    #[clap(index = 1)]
    file: PathBuf,
}

fn convert(name: &str, dir: &Path, img: &Path, size: usize, format: &str) -> Result<String, ()> {
    let out = format!("{}_{}.{}", name, size, format);
    let res = process::Command::new("convert")
        .current_dir(dir)
        .args(vec![
            "-geometry",
            format!("{}x{}", size, size).as_str(),
            img.to_str().unwrap(),
            out.as_str(),
        ])
        .output()
        .expect("convert");
    assert!(res.status.success());
    Ok(out)
}

macro_rules! exif_tag {
    ($meta:ident, $tag:ident) => {
        format!(
            "{}",
            $meta
                .get(&exif::Tag::$tag)
                .unwrap()
                .display_as(exif::Tag::$tag)
        )
        .replace("\"", "")
        .trim()
        .to_string()
    };
}

fn main() {
    let args = Args::parse();

    let source_file = std::fs::File::open(&args.file).unwrap();

    let mut bufreader = std::io::BufReader::new(&source_file);
    let exif = exif::Reader::new()
        .read_from_container(&mut bufreader)
        .unwrap();

    let name_slug = to_snake_case(&args.name);

    let metadata: HashMap<exif::Tag, exif::Value> =
        exif.fields().map(|f| (f.tag, f.value.clone())).collect();

    let extension = args.file.extension().unwrap().to_str().unwrap();
    let file_name = format!("{}.{}", name_slug, extension);
    let tmp_dir = tempdir().unwrap();
    let tmp_file = tmp_dir.path().join(file_name.clone());

    fs::copy(&args.file, tmp_file).unwrap();

    let photo = Photo {
        title: args.name.clone(),
        date: exif_tag!(metadata, DateTimeOriginal),
        params: PhotoParams {
            iso: exif_tag!(metadata, StandardOutputSensitivity),
            focal_length: exif_tag!(metadata, FocalLength),
            f_number: exif_tag!(metadata, FNumber),
            ev: exif_tag!(metadata, ExposureBiasValue),
            exposure: exif_tag!(metadata, ExposureTime),
            model: exif_tag!(metadata, Model),
            make: exif_tag!(metadata, Make),
            srcset: SrcSet {
                jpg512: convert(&name_slug, tmp_dir.path(), &args.file, 512, "jpg").unwrap(),
                jpg1024: convert(&name_slug, tmp_dir.path(), &args.file, 1024, "jpg").unwrap(),
                jpg2048: convert(&name_slug, tmp_dir.path(), &args.file, 2048, "jpg").unwrap(),
                webp512: convert(&name_slug, tmp_dir.path(), &args.file, 512, "webp").unwrap(),
                webp1024: convert(&name_slug, tmp_dir.path(), &args.file, 1024, "webp").unwrap(),
                webp2048: convert(&name_slug, tmp_dir.path(), &args.file, 2048, "webp").unwrap(),
                original: file_name.clone(),
            },
        },
    };

    let res = process::Command::new("rclone")
        .args(vec![
            "copy",
            tmp_dir.path().as_os_str().to_str().unwrap(),
            "cloudflare:photos",
        ])
        .output()
        .expect("rclone to cloudflare");

    let mut file = File::create(format!(
        "content/photos/{}.md",
        to_snake_case(args.name.as_str())
    ))
    .expect("create entry in dzx");

    file.write("---\n".as_bytes());
    let front_matter = serde_yml::to_writer(&file, &photo).unwrap();
    file.write("---\n".as_bytes());
}

fn to_snake_case(s: &str) -> String {
    let mut snake_case = String::new();
    let mut last_was_separator = false;

    for c in s.chars() {
        if c.is_ascii_alphanumeric() {
            if last_was_separator && !snake_case.is_empty() {
                snake_case.push('_');
            }

            snake_case.push(c.to_lowercase().next().unwrap());

            last_was_separator = false;
        } else {
            last_was_separator = true;
        }
    }

    snake_case
}
