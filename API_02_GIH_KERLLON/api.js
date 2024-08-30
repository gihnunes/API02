//Consultar tarefa por id
//Atualizar os status de uma tarefa

//1 requires 
const express = require('express');
const mysql = require('mysql2');
const cors = require ('cors');

const mysql_config = require('./inc/mysql_config');
const functions = require('./inc/functions');

//2 criação de duaas constantes para definnição da disponiilidade da
//api e da versão da api

 const API_AVAIABILITY = true;
 const API_VERSION = '1.0.0';
 
 //3 iniciar o server 
 const app = express();
 app.listen(3000, ()=>{
    console.log("API está executando")
 })

 //4 checar  se API está disponível
 app.use((req, res, next)=>{
    if (API_AVAIABILITY){
        next();
    } else{
        res.json(functions.response('atenção', 'API está em manutenção. Sinto muito ',0,null))
    }
 }) 
 
 //5 mysql connection
 const conncetion = mysql.createConnection(mysql_config)
 
 //6 cors 
 app.use(cors());

 //7 rotas
 //rota inicial que vai dizer  que a API está disponível
 app.get('/', (req,res)=>{
    req.json(functions.response('sucesso', 'API está rodando',0,null))
 })

 //9 rota para pegar todas as tarefas
 app.get('/tasks',(req,res)=>{
    conncetion.query('SELECT * FROM tasks',(err, rows))
 })

 //10 rota para pegar a task pelo id 
 app.get('/tasks/:id', (req,res)=>{
   const id = req.params.id;
   conncetion.query('SELECT * FROM tasks WHERE id=?', [id], (err, rows)=>{
      if(!err){
         //devolver os dados das tasks
         if(rows.lengt>0){
            res.json(functions.response('Sucesso', 'sucesso na pesquisa ', rows.lengt,rows))
         }else{
            res.jason(functions.response('Atenção', 'Nao foi possivel encontrar a task solicitada', 0, null))
         }
      }
      else{
         res.json(functions.response('error', err.message, 0, null))
      }
   })
 })
//11 atualizar os status de uma task - metodo
app.put('/tasks/:id/status/:status',(req,res)=>{
   const id = req.params.id;
   const status = req.params.status;
   conncetion.query('UPDATE tasks Set status =? WHERE id=?', [status,id],(err,rows)=>{
      if(!err){
         if(rows.affectedRows>0){
            res.json(functions.response('Sucesso','Sucesso na alteração do status ',rows.affectedRows, null))
         }
         else{
               res.json(functions.response('Atenção ', ' Task não encontrada ',0,null))
               
            }
         
      }
      else{
         res.json(functions.response('erro',err.message,0,null))
      }
      })
})

 //8 midleware para caso alguma rota não seja encontrada
 app.use((req,res)=>{
    res.json(functions.response('atenção', 'Rota não encontrada', 0,null))
 })
