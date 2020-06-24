json.extract! userposition, :id, :userid, :x, :y, :z, :created_at, :updated_at
json.url userposition_url(userposition, format: :json)
