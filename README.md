# iiiExhibition extra 2020 Exhibition space

# How to start

* Dockerをインストールする
    * https://docs.docker.com/docker-for-mac/install/
    * dockerとdocker-composeを利用します．Macの場合はdocker-composeも付属してくる．
    * Railsのイメージはほぼこれの通りに作っています (参考: https://docs.docker.com/compose/rails/)
* このリポジトリをクローンする
* `cd iiiex_extra2020_exhibition_space`
* `docker-compose run web yarn install --check-files`
    * yarnでインストールするもの（JSのライブラリなど）が増えない限り初回以外はやらなくて良いはず
    * 初回はyarn install以外にDockerコンテナのビルドが走るので実行時間が長い
* `docker-compose up`
* （初回のみ）別のターミナルで `docker-compose run web rake db:create`
    * tmp/dbというところにデータベースのファイルがおいてあるので一度作ってしまえば2回目以降起動するときはしなくて良い
* ブラウザで `localhost:3000` を開く
* 終了するときはCtrl-Cで停止する．
* 終わったらDocker desktopは終了して良い．


# フロントエンドのコードの書き方

How to startの手順でサーバーを起動して `http://localhost:3000/space/index` または `http://localhost:3000/` （ルートに設定してあります）にアクセスすると，展示空間用のページを開けます

## 以下を編集してください．

### HTML
HTMLに相当するファイル: `app/views/space/index.html.erb`

### JavaScript
JavaScript: `app/javascript/packs/space_index.js`

JavaScriptはES6です．Rails 6のデフォルトの通り，yarnでパッケージ管理してwebpackがpackしてるので，space_index.jsの冒頭でthree.jsをimportしています．
別のJSファイルを作るときは，`app/javascript/packs` の下に作成し，関数などを

```
export function hello(name) {
  console.log("Hello " + name + "!");
}
```

のように書いておいて

```
import { hello } from './hello';
```

とすれば読み込めます．

UIフレームワークのような全ページに読み込むようなものは，`app/javascript/packs/application.js` に以下のようにしておけば実行されます．

```javascript
require("bootstrap");
require("@fortawesome/fontawesome-free");

```

パッケージを追加する際は，
`docker-compose run web yarn add three`
のようにやってください．

詳しくは以下のページがわかりやすいです．dockerを使ってないのでコマンドの先頭に `docker-compose run web` がついていないのでその辺りは注意してください．
https://techracho.bpsinc.jp/hachi8833/2020_01_16/85940


JavaScriptは，View(HTML)のファイルで，以下のように読み込みます．
JavaScriptのなかでimportする形ではなくファイルを追加する場合は，これを使います．
普通は`javascript_pack_tag`を使うのですが，packした時にchunkに分割するようにしているので，
こちらを使うよう注意してください．

```ruby
<%= javascript_packs_with_chunks_tag 'space_index' %>
```

### SCSS

#### 基本

* 全てのページで共通するスタイルを記述する: `/app/assets/stylesheets/application.css`にかく
* 展示空間ページのみのスタイルを記述する: `/app/assets/stylesheets/space.scss`にかく

#### 外部のスタイルシートを追加するとき

Bootstrapみたいなものはyarnでパッケージとして追加できるので，できれば使用してください．

特にパッケージがなくて，cssだけ配られているようなものは，`/public/css`においてください．
読み込むときは`space.html.erb`などで以下のように記述してください．

```ruby
<%= stylesheet_link_tag '/css/your_stylesheet.css', media: 'all' %>
```

### モデル

`/public/model`においてください．読み込むときは`/model/iiiEx_field.gltf`のように，`public` を除いたパスを指定して読み込んでください．
このとき，必ず絶対パス (`/`で始まるパス) で書いてください．先頭に `/` がつかない相対パスはだと正しく読み込まれない場合があります．

### 画像ファイル等

モデルと同様に、`/public/images`において読み込んでください。動画などを置く場合も適宜`/public`の下にフォルダを作っておけば大丈夫です。
