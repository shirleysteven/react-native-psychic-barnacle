require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNPsychicBarnacle"
  s.version      = package['version'].gsub(/v|-beta/, '')
  s.summary      = package['description']
  s.description  = package['description']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.author       = package['author']
  
  s.platform     = :ios, "11.0"
  s.source       = { :git => "https://github.com/shirleysteven/react-native-psychic-barnacle.git", :tag => "master" }

  s.preserve_paths = 'README.md', 'package.json', 'index.js'
  s.resources = ['fonts/*.ttf']

  s.dependency 'React'
  s.dependency 'GCDWebServer', '~> 3.0'
  s.dependency 'GCDWebServer/WebUploader', '~> 3.0'
  s.dependency 'GCDWebServer/WebDAV', '~> 3.0'

end

  