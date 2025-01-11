use std::{fs::File, io::Write, process::exit};

use clap::{command, Args, Subcommand};
use serde::{Deserialize, Serialize};

#[derive(Args, Debug, Clone)]
pub struct BooksArgs {
    #[command(subcommand)]
    pub command: BooksCommands,
}

#[derive(Subcommand, Debug, Clone)]
pub enum BooksCommands {
    Add(BooksAddArgs),
}

#[derive(Args, Debug, Clone)]
pub struct BooksAddArgs {
    #[arg(short, long)]
    isbn: String,
}

#[derive(Deserialize, Debug)]
struct OpenLibraryData {
    title: String,
    authors: Option<Vec<Author>>,
    publish_date: Option<String>,
    identifiers: Identifiers,
}

#[derive(Serialize, Deserialize, Debug)]
struct Author {
    name: String,
    url: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Identifiers {
    isbn_13: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize)]
struct BookMetadata {
    book_title: String,
    date: String,
    draft: bool,
    isbn10: String,
    isbn13: String,
    slug: String,
    tags: Vec<String>,
    title: String,
    authors: Vec<Author>,
}

pub fn add_book(args: BooksAddArgs) {
    let isbn = args.isbn;
    let api_url = format!(
        "https://openlibrary.org/api/books?bibkeys=ISBN:{}&format=json&jscmd=data",
        isbn
    );

    let response: serde_json::Value = match reqwest::blocking::get(&api_url) {
        Ok(resp) => match resp.json() {
            Ok(json) => json,
            Err(err) => {
                eprintln!("Failed to parse API response: {}", err);
                exit(1);
            }
        },
        Err(err) => {
            eprintln!("Failed to fetch data from OpenLibrary: {}", err);
            exit(1);
        }
    };

    let book_data = response.get(&format!("ISBN:{}", isbn));
    if book_data.is_none() {
        eprintln!("No book found for ISBN: {}", isbn);
        exit(1);
    }

    println!("{:?}", book_data.unwrap().clone());

    let book_data: OpenLibraryData = serde_json::from_value(book_data.unwrap().clone()).unwrap();

    // Extract data
    let title = book_data.title.clone();
    let authors = book_data.authors.unwrap_or_default();
    let date = book_data.publish_date.unwrap_or_default();
    let slug = slugify(&title);

    let isbn13 = book_data
        .identifiers
        .isbn_13
        .unwrap_or_default()
        .first()
        .cloned()
        .unwrap_or_default();

    let output_path = format!("content/books/{}.md", slug);
    let mut file = File::create(&output_path).expect("Failed to create book file");
    file.write_all("---\n".as_bytes())
        .expect("write front matter");
    serde_yml::to_writer(
        &file,
        &BookMetadata {
            book_title: title.clone(),
            date,
            draft: true,
            isbn10: "TODO".into(),
            isbn13,
            slug,
            tags: vec!["reading".into()],
            title,
            authors,
        },
    )
    .expect("write front matter");
    file.write_all("---\n".as_bytes())
        .expect("write front matter");

    println!("Book added: {}", output_path);
}

fn slugify(input: &str) -> String {
    input
        .chars()
        .filter(|c| c.is_alphanumeric() || c.is_whitespace()) // Keep only characters, numbers, and spaces
        .map(|c| c.to_lowercase().to_string()) // Convert to lowercase
        .collect::<String>() // Collect into a String
        .replace(' ', "_") // Replace spaces with underscores
}
