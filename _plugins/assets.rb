
require "sprockets"
require "sprockets-less" # This extention fixes less @import
require "jekyll-assets"

# Append all asset sub directories to asset path
# Needed to get relative less imports
sources = Jekyll.configuration({})['assets']['sources']
for d in sources
    for f in Dir[File.join(d, '*/*')]
        if File.directory?(f)
            Sprockets.append_path File.expand_path f
        end
    end
end

# Generator to append all missing asset files
module Jekyll
  module Own

    class AssetFile < Jekyll::StaticFile

      def destination(dest)
        if @dir[0] == '_'
            File.join(dest, @dir.sub('_', ''), @name)
        else
            File.join(dest, @dir, @name)
        end
      end
    end

    class AssetGenerator < Jekyll::Generator
        safe true

        def generate(site)
            source = site.config['assets']['sources'][0]
            for f in Dir[File.join(source, 'img', '**/*')] + Dir[File.join(source, 'fonts', '**/*')]
                if File.file?(f)
                    name = File.basename(f)
                    destination = File.dirname(f).sub(site.source, '')
                    f = AssetFile.new(site, site.source, destination, name)
                    site.static_files << f
                end
            end
        end
     end
  end
end

# Less alternative
#require "jekyll-less"