class CreateUserpositions < ActiveRecord::Migration[6.0]
  def change
    create_table :userpositions do |t|
      t.integer :userid
      t.float :x
      t.float :y
      t.float :z

      t.timestamps
    end
  end
end
