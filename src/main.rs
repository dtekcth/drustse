extern crate hyper;

use hyper::server::{Request, Response};

static HELLO_WORLD: &'static [u8] = b"Hello Vorld!";

fn hello(_: Request, resp: Response) {
    resp.send(HELLO_WORLD).unwrap();
}

fn main() {
    let _ = hyper::Server::http("192.168.0.40:8040")
                .unwrap()
                .handle(hello);

    println!("Listening on http://192.168.0.40:8040");
}
