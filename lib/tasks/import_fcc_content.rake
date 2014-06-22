require 'CSV'

desc "Import data from csv file"
task :import => [:environment] do

  article = Article.create({
    :title => "Protecting and Promoting the Open Internet NPRM"
  }) 

  header_rank = 0
  seen_section_heads = []
  CSV.foreach('lib/assets/data.csv', :headers => true) do |row|

    section_name = row['Section_Name']
    header_name = row['Header']
    sub_header_name = row['Sub_Header']
    sub_sub_header_name = row['Sub_sub_head']

    if header_name
      section_name += ":" + header_name
      if sub_header_name
        section_name += ":" + sub_header_name
        if sub_sub_header_name
          section_name += ":" + sub_sub_header_name
        end
      end
    end

    if seen_section_heads.include?(section_name)
    else
      Section.create({
        :name => section_name,
        :rank => header_rank,
        :article_id => article.id
      }) 

      seen_section_heads << section_name
    end

    header_rank += 1
  end

  rank = 0
  seen_tags = []
  seen_section_heads = []
  CSV.foreach('lib/assets/data.csv', :headers => true) do |row|

    section_name = row['Section_Name']
    header_name = row['Header']
    sub_header_name = row['Sub_Header']
    sub_sub_header_name = row['Sub_sub_head']

    if header_name
      section_name += ":" + header_name
      if sub_header_name
        section_name += ":" + sub_header_name
        if sub_sub_header_name
          section_name += ":" + sub_sub_header_name
        end
      end
    end

    section_id = Section.where('name=?', section_name).first.id

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