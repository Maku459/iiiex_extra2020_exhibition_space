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

HTMLに相当するファイル: `app/views/space/index.html.erb`
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

パッケージを追加する際は，
`docker-compose run web yarn add three`
のようにやってください．

詳しくは以下のページがわかりやすいです．dockerを使ってないのでコマンドの先頭に `docker-compose run web` がついていないのでその辺りは注意してください．