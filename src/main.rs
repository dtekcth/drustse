extern crate hyper;

use hyper::server::{Request, Response};

static HELLO_WORLD: &'static [u8] = b"Hello World!";

fn hello(_: Request, resp: Response) {
    resp.send(HELLO_WORLD).unwrap();
}

fn main() {
    let _ = hyper::Server::http("127.0.0.1:3000")
                .unwrap()
                .handle(hello);

    println!("Listening on http://127.0.0.1:3000");
}
