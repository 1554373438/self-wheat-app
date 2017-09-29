
read -p "生产环境打包？(yes/no)" packageType
if [ "$packageType" = "yes" ]
then
echo ********生产环境打包开始（不包含maps）********
gulp prod
else
echo ********测试环境打包开始（包含maps）********
gulp 
fi
echo ********生成完毕，请将dist目录下所有文件进行部署******build