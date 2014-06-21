class CreateClips < ActiveRecord::Migration
  def change
    create_table :clips do |t|
      t.references :paragraph, index: true
      t.text :comment
      t.references :response, index: true

      t.timestamps
    end
  end
end
