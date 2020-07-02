class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.boolean :agreeCookie
      t.boolean :isExist

      t.timestamps
    end
  end
end
