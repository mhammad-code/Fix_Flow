from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import urlopen

url = "http://127.0.0.1:5501/index.html"

try:
    with urlopen(url, timeout=1) as response:
        if b"<title>FixFlow | Home" in response.read():
            print("Serving HTTP on 127.0.0.1 port 5501 (existing server)")
            raise SystemExit(0)
except OSError:
    pass

server = ThreadingHTTPServer(("127.0.0.1", 5501), SimpleHTTPRequestHandler)
print("Serving HTTP on 127.0.0.1 port 5501")
server.serve_forever()
