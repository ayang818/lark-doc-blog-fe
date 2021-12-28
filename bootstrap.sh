docker build -t "lard_doc_blog_fe:1.0" .
echo 'suc build frontend'
docker rm -fv "open_lark_doc_blog_fe_runner"
echo "suc delete frontend"
docker run -d --name "open_lark_doc_blog_fe_runner" -p 80:3000 lard_doc_blog_fe:1.0
echo 'suc run frontend'