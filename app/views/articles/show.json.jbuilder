json.id @article.id
json.title @article.title
json.(@article, :created_at, :updated_at)

json.sections @article.sections do |section|
  json.id section.id
  json.name section.name
  json.rank section.rank

  json.paragraphs section.paragraphs do |paragraph|
    json.id paragraph.id
    json.content paragraph.content
    json.summary paragraph.summary
    json.rank paragraph.rank

    # make tags an array of tags, not objects
    json.tags paragraph.tags do |tag|
      json.id tag.id
      json.content tag.content
    end
  end
end