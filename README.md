
# Alpha Sync

The purpose of this package is to extract photos wirelessly from Sony Alpha Cameras! It was created because I went on holiday to the lake district, filled my camera up with pictures and had no way of getting them off the camera onto my Apple M1 Laptop. It utilises UPNP protocols to get the images that we discovered via packet sniffing. These are the commands used by the Imaging Edge app.


## Installation

Install my-project with npm

```bash
  npm install alpha_sync
```
    
## Usage/Examples

The following code snippet tries to discover the content directory service on the camera. It then constructs a tree using depth first search of all the images in the cameras file system. It then downloads all those images into the file ./images.

```javascript
const {AlphaSync} = require('alpha_sync')
const as = new AlphaSync()

as.discover_avaliable_services()
  .then(async () => {await as.generate_tree()})
  .then(async ()=>{await as.get_all_images_dict('./images')})
  .catch((error) => console.log(error))
```


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
 - Daisy Coburn, for inviting my on the holiday that inspired this project


## Lessons Learned

I started this project in 2021 writing it in Swift. Deeply regret that. Sometimes the cast of High School Musical is right "It is better by far to keep things as they are,
Don't mess with the flow, no, no,
Stick to the status quo"


## Documentation

[Documentation](https://dart120.github.io/alpha_sync/)

