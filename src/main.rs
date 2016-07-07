extern crate nickel;

use nickel::{Nickel, HttpRouter};
use std::sync::{ Arc, Mutex };

fn main() {
    let mut visitor_count: u64 = 0;

    let shared_count = Arc::new(Mutex::new(visitor_count));

    let server = Nickel::new();

    server.listen("127.0.0.1:8040");



    server.get("/", middleware! { |_, res|
        let mut data = HashMap::<&str, &str>::new();
        data.insert("name", "user");
        return res.render("examples/assets/template.tpl", &data)
    });

    println!("Listening on http://127.0.0.1:8040");
}
