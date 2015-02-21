# Custom Field Suite Markdown Add-On

A simple Markdown add-on for [Custom Field Suite](http://customfieldsuite.com/)

__Contributors:__ [Robert Neu](https://github.com/robneu)  
__Requires:__ CFS 2.4, WordPress 4.1.1  
__Tested up to:__ CFS 2.4, WordPress 4.1.1  
__License:__ [GPL-2.0+](http://www.gnu.org/licenses/gpl-2.0.html)  

This is a small add-on for Custom Field Suite which adds a Markdown field type. The field works similarly to the standard textarea input except that it accepts [Markdown syntax](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). In addition to being able to parse and display markdown correctly on the front end, the field also features a WYSIWYG-ish toolbar and a live Markdown preview window to make adding Markdown easier.

![Standard Field](https://cloud.githubusercontent.com/assets/2184093/6314792/1e1ba420-b9b2-11e4-96ab-6142ec38f782.png)

![Loop Field](https://cloud.githubusercontent.com/assets/2184093/6314793/1e343198-b9b2-11e4-9c6b-8142dad45b6e.png)

Markdown support is added using the [Parsedown](http://parsedown.org/) class by [Emanuil Rusev](https://github.com/erusev).

Markdown preview and WYSIWYG toolbar uses a modified version of [Meltdown](https://github.com/iphands/Meltdown)

## Installation
* Click the "Download ZIP" button on the right side of this GitHub page.
* Upload the unzipped folder into the /wp-content/plugins/ directory, OR
* Upload the zip file into WordPress (Plugins > Add New > Upload)
* Activate the plugin (CFS must also be active)

### Git

Clone this repository in `/wp-content/plugins/`:

`git clone https://github.com/robneu/cfs-markdown.git`

Then go to the __Plugins__ screen in your WordPress admin panel and click the __Activate__ link under CFS - Markdown Add-On.

## Updating ##

There are a couple of plugins for managing updates to GitHub-hosted plugins. Either of these should notify you when this plugin is updated:

* [Git Plugin Updates](https://github.com/brainstormmedia/git-plugin-updates)
* [GitHub Updater](https://github.com/afragen/github-updater)
