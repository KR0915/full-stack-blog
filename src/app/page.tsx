import { PostType } from "@/types";
import Image from "next/image";
import Link from "next/link";


//データベースからすべてのブログを取得してくる
async function fetchAllBlogs(){
  const res=await fetch(`http://localhost:3000/api/blog`,{
    cache:"no-store",//SSR(サーバーサイドレンダリング)　SSGの場合はforce-cache
  });//SSRを使う理由はブログがどんどん増えていき、更新が頻繁に起こるから

  const data=await res.json();//json形式で定義する

  return data.posts;//postsはGET ALL BLOGSのデータの名前
}

export default async function Home() {
  const posts=await fetchAllBlogs();//
  return (
    <main className="w-full h-full">
  <div className="md:w-2/4 sm:w-3/4 m-auto p-4 my-5 rounded-lg bg-blue-900 drop-shadow-xl">
    <h1 className="text-slate-200 text-center text-2xl font-extrabold">
      Full Stack Blog 📝
    </h1>
  </div>
  {/* Link */}
  <div className="flex my-5">
    <Link
      href={"/blog/add"}//ブログを新規作成するときに違うページを渡す
      className=" md:w-1/6 sm:w-2/4 text-center rounded-md p-2 m-auto bg-slate-300 font-semibold"
    >
      ブログ新規作成
    </Link>
  </div>

  <div className="w-full flex flex-col justify-center items-center">
    {posts.map((post:PostType)=>(//post:PostTypeで定義されたデータすべてにhtmlで処理する
          <div key={posts.id}//GET ALL BLOGSのpostsのidをkeyに設定してhtmlとひも付ける
          className="w-3/4 p-4 rounded-md mx-3 my-2 bg-slate-500 flex flex-col justify-center">
          <div className="flex items-center my-3">
            <div className="mr-auto">
              <h2 className="mr-auto font-semibold text-slate-50">
                {post.title}
                {/*postで定義されたデータのtitleをここで表示する*/}
                </h2>
            </div>
            <Link
              href={`/blog/edit/${post.id}`}//リンク先のurlをしていしている
              className="px-4 py-1 text-center text-xl bg-slate-900 rounded-md font-semibold text-slate-200"
            >
              編集
            </Link>
          </div>
    
          <div className="mr-auto my-1">
            <blockquote className="font-bold text-slate-100">
              {new Date(post.date).toDateString()}
              {/*post.dateだとデータ型のままでReactNodeに割り当てられないのでstring型に書き直す*/}
            </blockquote>
          </div>
    
          <div className="mr-auto my-1 text-slate-100">
            <h2>
              {post.description}
            </h2>
          </div>
        </div>
    ))}

  </div>
</main>
  );
}
