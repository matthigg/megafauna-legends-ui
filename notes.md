# Bugs

- When interacting with walking NPCs, sometimes their position becomes mis-aligned somehow and will be 1 or 2 pixels off. For example, if the base grid size is 32 x 32 pixels an NPC may somehow end up with a location of (30, 32) instead of (32, 32).

- Interacting with components outside of the /overworld route seems to cause either multiple promises to not resolve or otherwise duplicate a lot of code functionality, eg. the hero character may start running super fast
