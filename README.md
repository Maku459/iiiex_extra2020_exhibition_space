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
