# Procgen viewer
Simple web project in threejs and typescript for generating and viewing procedurally generated maps for Dwarf Station

## How to run it?

### Requirements:
Running it requires node or built static files, which building also requires node.

Download node here: https://nodejs.org/en/

### Usage: 

Clone repository, go into cloned directory and execute following commands:

`npm i` - this does install node dependencies for project

`npm run dev` - this performs build on the time and set's up local server 

Application should be now hosted on your local machine, by default it should be on the address:

`http://localhost:8080`

## Additional informations

Saving biomes and turfs currently is done by separate button `Saves Biomes Data`, on bottom of the GUI. 

:warning: Biomes save is currently one slot only, so any saved changes are overwritten and are carried through all DAT GUI saved presets!
