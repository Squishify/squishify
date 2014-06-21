class CreateResponses < ActiveRecord::Migration
  def change
    create_table :responses do |t|
      t.string :url
      t.boolean :is_private
      t.text :content

      t.timestamps
    end
  end
end
