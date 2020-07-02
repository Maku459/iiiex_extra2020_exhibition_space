# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_07_01_143120) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "logins", force: :cascade do |t|
    t.boolean "isExist"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "souvenirs", force: :cascade do |t|
    t.text "impression"
    t.float "works_1"
    t.float "works_2"
    t.float "works_3"
    t.float "iris_11"
    t.float "iris_12"
    t.float "iris_13"
    t.float "iris_14"
    t.float "iris_21"
    t.float "iris_22"
    t.float "iris_23"
    t.float "iris_24"
    t.float "iris_31"
    t.float "iris_32"
    t.float "iris_33"
    t.float "iris_34"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "userpositions", force: :cascade do |t|
    t.integer "userid"
    t.float "x"
    t.float "y"
    t.float "z"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.boolean "agreeCookie"
    t.boolean "isExist"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "works", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
