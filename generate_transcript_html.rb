require 'redcarpet'

subrip = File.read(ARGV[0]).scan(/(\d+:\d+:\d+,\d+) --> (\d+:\d+:\d+,\d+)/)
script = File.read(ARGV[1]).split("\n")

if subrip.size != script.size
  abort "sizes don't match. (subrip: #{subrip.size}, script: #{script.size})"
end

markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML)

transcript = subrip.zip(script).map{|(start, finish), text|
  <<HTML
<p data-start-time="#{start}" data-end-time="#{finish}">
  #{markdown.render(text).chomp.gsub(/<\/?p>/, "")}
</p>
HTML
}.join

html = <<HTML
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Admins Bar Transcript</title>
    <link rel="stylesheet" href="transcript.css">
    <script src="http://cdn.popcornjs.org/code/dist/popcorn-complete.min.js"></script>
  </head>
  <body>
    <div id="audio"></div>
    <div class="transcript">
#{transcript}
    </div>
    <script src="script.js"></script>
  </body>
</html>
HTML

puts html
