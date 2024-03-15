import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma=new PrismaClient();//インスタンス化

export async function main(){//ここのコードは非同期通信でprismaにつなる　エラーが起こったときにDB接続に失敗しましたと返す。
    try{
        await prisma.$connect();
    }catch(err){
        return Error("DB接続に失敗しました")
    }
}

//ブログの全記事取得のAPI
export const GET=async(req:Request,res:NextResponse)=>{
    try{//とりあえずtry文の処理を実行してみるerrが発生したらcatch文に渡すerrが発生しなくてもfinally文に渡す
        await main();
        const posts=await prisma.post.findMany();//findManyは全記事取得の内容を表す　postはprismaのデータ型のを小文字にしたもの　ここでデータベースからデータ全取得
        return NextResponse.json({message:"Success",posts},{status:200});//postに成功したときの内容とサーバーの情報200をかえす
    }catch(err){
        return NextResponse.json({message:"Error",err},{status:500});//エラーの内容とサーバーエラーの500番をかえす
    }finally{
        await prisma.$disconnect();//強制的にプリズマからの接続をきる
    }
};

//ブログ投稿用API
export const POST=async(req:Request,res:NextResponse)=>{
    try{
        const{title,description}=await req.json();//reqの中にあつデータをjson形式にしてtitleとdescriptionにわたしている
                                                  //今まではreq.bodyの関数でデータを取り出していた。
        await main();
        const post=await prisma.post.create({data:{title,description}});//createはprismaの関数でデータを作成し、データベースに送る事ができる
        return NextResponse.json({message:"Success",post},{status:201});//リソースの作成に成功したときは201番を返す
    }catch(err){
        return NextResponse.json({message:"Error",err},{status:500});
    }finally{
        await prisma.$disconnect();
    }
}