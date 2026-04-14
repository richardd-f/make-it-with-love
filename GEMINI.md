UI Rules
1. use this color palette:
#f6e5c4 60%
#32a569 15%
#f79d1c 10%
#ea7c9d 10%
#e4552c 5%

2. when using popup modal, the background is blured
3. use flex over grid
4. use same UI style with previous/other pages UI style

Logic Rules
1. remove unused import
2. make sure there is no linting or typescript error
3. make sure it using clean architecture (Feature-Based Architecture)
4. if there are many server actions in one feature, create a new folder for groups of server actions
5. if it need an interface, create a separate file for it
6. if there are many interface file, create a folder for groups of interfaces
7. if it need a component, create a separate file for it
8. if there are many component file, create a folder for groups of components
10. do not put server action or logic function in UI code, put it in server actions file/folder

