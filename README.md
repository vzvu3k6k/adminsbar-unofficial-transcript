# Admins Bar Transcript

[Admins Bar](http://adminsbar.mirakui.com/)の[#1 - MySQL in the Real World](https://soundcloud.com/adminsbar/adminsbar-1)の[一部を書き起こした](https://github.com/vzvu3k6k/adminsbar-unofficial-transcript/blob/master/transcripts/ep001.txt)。内容の正確性は保証しない。

## How to Build

```
$ gem install redcarpet
$ ruby generate_transcript_html.rb transcripts/ep001.srt transcripts/ep001.txt > ep1.html
```

プレイヤーと同期して、再生されている部分の書き起こしをハイライトしたりするインタラクティブな書き起こしビューアー的なものが生成される。YouTubeの書き起こしタブに近い（例: [Git - YouTube](http://www.youtube.com/watch?v=8dhZ9BXQgc4)）。

生成されたHTMLファイルは`file://`上で開くとXHRに失敗してうまく動かないので、適当なサーバーに置いてアクセスする。

### なぜsrtとtxtに分かれているのか

発言の位置を入力するには、波形ビューアーがある[Subtitle Editor](http://home.gna.org/subtitleeditor/)が便利だが、長文を入力するのには向いていない。そのため、エディタで発言を書き起こして（ep001.txt）、
[Subtitle Editor](http://home.gna.org/subtitleeditor/)で発言の位置だけを入力して（ep001.srt）、2つを合成するという手順を取った。

## License

[Admins Bar #1 - MySQL in the Real World](https://soundcloud.com/adminsbar/adminsbar-1)は[CC BY-NC-SA 3.0](http://creativecommons.org/licenses/by-nc-sa/3.0/)でライセンスされている。作者は[@mirakui](http://twitter.com/mirakui)、[@con_mame](https://twitter.com/con_mame)、[@mineroaoki](https://twitter.com/mineroaoki)。

Admins Barの書き起こしも同じく[CC BY-NC-SA 3.0](http://creativecommons.org/licenses/by-nc-sa/3.0/)でライセンスされる。

その他のファイルのライセンスは[CC0](http://creativecommons.org/publicdomain/zero/1.0/)。
