# iiiExhibition extra 2020 Exhibition space

# How to start

* Dockerをインストールする
    * https://docs.docker.com/docker-for-mac/install/
    * dockerとdocker-composeを利用します．Macの場合はdocker-composeも付属してくる．
    * Railsのイメージはほぼこれの通りに作っています (参考: https://docs.docker.com/compose/rails/)
* このリポジトリをクローンする
* `cd iiiex_extra2020_exhibition_space`
* `docker-compose up`
* （初回のみ）別のターミナルで `docker-compose run web rake db:create`
* ブラウザで `localhost:3000` を開く