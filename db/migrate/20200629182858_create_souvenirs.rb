class CreateSouvenirs < ActiveRecord::Migration[6.0]
  def change
    create_table :souvenirs do |t|
      t.text :impression
      t.float :works_1
      t.float :works_2
      t.float :works_3
      t.float :iris_11
      t.float :iris_12
      t.float :iris_13
      t.float :iris_14
      t.float :iris_21
      t.float :iris_22
      t.float :iris_23
      t.float :iris_24
      t.float :iris_31
      t.float :iris_32
      t.float :iris_33
      t.float :iris_34

      t.timestamps
    end
  end
end
