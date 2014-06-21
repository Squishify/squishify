# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140621223552) do

  create_table "articles", force: true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "clips", force: true do |t|
    t.integer  "paragraph_id"
    t.text     "comment"
    t.integer  "response_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "clips", ["paragraph_id"], name: "index_clips_on_paragraph_id"
  add_index "clips", ["response_id"], name: "index_clips_on_response_id"

  create_table "paragraphs", force: true do |t|
    t.text     "content"
    t.text     "summary"
    t.integer  "rank"
    t.integer  "section_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "paragraphs", ["section_id"], name: "index_paragraphs_on_section_id"

  create_table "paragraphs_tags", force: true do |t|
    t.integer "paragraph_id"
    t.integer "tag_id"
  end

  add_index "paragraphs_tags", ["paragraph_id"], name: "index_paragraphs_tags_on_paragraph_id"
  add_index "paragraphs_tags", ["tag_id"], name: "index_paragraphs_tags_on_tag_id"

  create_table "responses", force: true do |t|
    t.string   "url"
    t.boolean  "is_private"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sections", force: true do |t|
    t.string   "name"
    t.integer  "rank"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "article_id"
  end

  create_table "tags", force: true do |t|
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
