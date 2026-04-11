use books::{BooksArgs, BooksCommands, add_book};
use clap::{Parser, Subcommand};
use photos::{PhotosArgs, PhotosCommands, add_photos};

mod books;
mod photos;

#[derive(Parser, Debug, Clone)]
#[command(version)]
#[command(name = "dzx")]
#[command(about = "Management of dzx.cz", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug, Clone)]
enum Commands {
    Photos(PhotosArgs),
    Books(BooksArgs),
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Photos(PhotosArgs {
            command: PhotosCommands::Add(args),
        }) => add_photos(args),
        Commands::Books(BooksArgs {
            command: BooksCommands::Add(args),
        }) => add_book(args),
    }
}
