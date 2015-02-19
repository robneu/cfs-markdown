# Custom Field Suite Markdown Add-On

A simple Markdown add-on for [Custom Field Suite](http://customfieldsuite.com/)

__Contributors:__ [Robert Neu](https://github.com/robneu)  
__Requires:__ CFS 2.4, WordPress 4.1.1  
__Tested up to:__ CFS 2.4, WordPress 4.1.1  
__License:__ [GPL-2.0+](http://www.gnu.org/licenses/gpl-2.0.html)  

This is a small add-on for Custom Field Suite which adds a Markdown field type. The field is nearly identical to the textarea field except that it supports [Markdown syntax](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). The option for automatically adding line breaks has also been removed as this can now be done using Markdown as-desired.

Markdown support is added using the [Parsedown](http://parsedown.org/) class by [Emanuil Rusev](https://github.com/erusev).

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
