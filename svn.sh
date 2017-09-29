svn delete svn://192.168.1.40/MSI-FE/h5/nono-app -m "delete nono-app"
svn mkdir svn://192.168.1.40/MSI-FE/h5/nono-app -m "create nono-app"
svn import ./dist/ svn://192.168.1.40/MSI-FE/h5/nono-app -m "upload dist"