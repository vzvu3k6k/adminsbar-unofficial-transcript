require 'redcarpet'

subrip = File.read(ARGV[0]).scan(/(\d+:\d+:\d+),\d+ --> (\d+:\d+:\d+),\d+/)
script = File.read(ARGV[1]).each_line.map(&:chomp)

if subrip.size != script.size
  abort "sizes don't match."
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
    <title></title>
    <script src="popcorn-complete.js"></script>
    <style>
      .transcript {
        height: 70vh;
        overflow-y: scroll;
      }

      .transcript .speaking {
        background-color: #cef;
      }
    </style>
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
