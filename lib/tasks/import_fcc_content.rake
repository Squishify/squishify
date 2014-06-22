require 'CSV'

desc "Import data from csv file"
task :import => [:environment] do

  article = Article.create({
    :title => "Protecting and Promoting the Open Internet NPRM"
  })

  section_introduction = Section.create({
    :name => 'INTRODUCTION',
    :rank => 0,
    :article_id => article.id
  })  

  section_background = Section.create({
    :name => 'BACKGROUND',
    :rank => 1,
    :article_id => article.id
  })

  section_discussion = Section.create({
    :name => 'DISCUSSION',
    :rank => 2,
    :article_id => article.id
  })

  section_procedural = Section.create({
    :name => 'PROCEDURAL MATTERS',
    :rank => 3,
    :article_id => article.id
  })

  section_ordering = Section.create({
    :name => 'ORDERING CLAUSES',
    :rank => 4,
    :article_id => article.id
  })

  rank = 0
  seen_tags = []
  CSV.foreach('lib/assets/data.csv', :headers => true, :encoding => 'ISO-8859-1:UTF-8') do |row|

    section_id = Section.where('name=?', row['Section_Name']).first.id

    p = Paragraph.create ({
      :content => row['Paragraph'],
      :summary => row['Summary_Sentence'],
      :section_id => section_id,
      :rank => rank
    })

    if row['Tags']
      row['Tags'].split(",").map(&:strip).each do |tag|
        if seen_tags.include?(tag)
        else
          t = Tag.create({
            :content => tag
          })
          p.tags << t
          seen_tags << tag
        end
      end
    end

    rank += 1
  end

end