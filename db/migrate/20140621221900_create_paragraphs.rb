class CreateParagraphs < ActiveRecord::Migration
  def change
    create_table :paragraphs do |t|
      t.text :content
      t.text :summary
      t.integer :rank
      t.references :section, index: true

      t.timestamps
    end
  end
end
