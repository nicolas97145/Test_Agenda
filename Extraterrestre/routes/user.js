
//Page d'inscription
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
	  var id= 5;
      var log= post.login;
      var mdp= post.mdp;
      var age= post.age;
      var famille= post.famille;
      var race= post.race;
	  var nourriture=post.nourriture;

      var sql = "INSERT INTO `membre`(`login`,`mdp`,`age`,`famille`, `race`, `nourriture`) VALUES ('" +  log + "','" + mdp + "','" + age + "','" + famille + "','" + race + "','" + nourriture + "')";

	  
     db.query(sql, function(err, result) {
         message = "Compte créé avec succès!";
         res.render('index.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//Page de connexion
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var log= post.login;
      var mdp= post.mdp;
     
      var sql="SELECT id, login, age, famille, race, nourriture FROM `membre` WHERE `login`='"+log+"' and mdp = '"+mdp+"'"; 
	
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log("ID membre : " + results[0].id);
            res.redirect('/home/accueil');
         }
         else{
            message = 'Identifiants incorrects!';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};

//Page d'accueil
           
exports.accueil = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `membre` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('accueil.ejs', {data:results});    
   });       
};

//Deconnexion
 
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};

//Liste des amis 

exports.amis = function(req, res, next){
   var i; 
   
   var user =  req.session.user,
   userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }  
   
  
 //Récupération de la liste des id amis
   var sql="SELECT id, login FROM `membre` WHERE `id` in (Select id_amis FROM `amis` where `id_extra`='"+userId+"')";

   db.query(sql, function(err, results){
	   if(results.length){	
			res.render('amis.ejs', {data:results});			
		}else{
			res.render('amis.ejs', {data:results});	
		}		
		 
   }); 
};


//Appel de la page ajout
exports.ajout = function(req, res, next){
	var i; 
	var message = '';
	var user =  req.session.user,
	userId = req.session.userId;
	if(userId == null){
      res.redirect("/login");
      return;
	}  
	res.render('ajout.ejs',{message:message});	

}


//Modification des informations
exports.modification = function(req, res){
   if(req.method == "POST"){
      var post  = req.body;
	  var userId= req.session.userId;
      var log= post.login;
      var age= post.age;
      var famille= post.famille;
      var race= post.race;
	  var nourriture= post.nourriture;
	  
	  var sql="SELECT mdp FROM `membre` WHERE `id`='"+userId+"'"; 
	
      db.query(sql, function(err, results){      
         if(results.length){
            var mdp = results[0].mdp;           
         }
	  });
	
		var sql = "UPDATE membre SET login = '"+log+"', age= '"+age+"', famille='"+famille+"', race='"+race+"', nourriture='"+nourriture+"' WHERE `id`='"+userId+"'";
		db.query(sql, function (err, result) {
		if (err) throw err;
			console.log("Modification effectué");
			res.redirect("/home/accueil");
		});

   } else {
      res.render('signup');
   }
};

//Permet l'ajout d'un nouvel ami
exports.ajouter = function(req, res){
   if(req.method == "POST"){
		var post  = req.body;
		var userId= req.session.userId;
		var nomAjouter=post.nameExtra;	
		var message = '';		
	  
		var sql="SELECT id FROM `membre` WHERE `login`='"+nomAjouter+"'";
		
		db.query(sql, function (err, results) {
			if(results.length){
				var sql2 = "INSERT INTO `amis`(`id_extra`,`id_amis`) VALUES ('" +  userId + "','" + results[0].id + "') ON DUPLICATE KEY UPDATE id_amis = id_amis, id_extra = id_extra ";
				db.query(sql2, function (err, results) {
					if (err) throw err;
					message = 'Ami ajouté!';
					res.render('ajout.ejs',{message: message});
				});
			}else{
				message = 'Nom inconnu, veuillez réessayer';
				res.render('ajout.ejs',{message: message});
			}
		});
	  
   }
};

//Permet la suppression d'un ami existant
exports.supprimer = function(req, res){
   if(req.method == "POST"){
	  res.redirect("/home/amis");
   }else{
		var userId= req.session.userId;
		var idRecup=req.param("id");
		var id = idRecup.split('');		
		
		var sql="DELETE FROM `amis` WHERE `id_extra`='"+userId+"' AND `id_amis`='"+id[1]+"'"; 
		
		db.query(sql, function (err, result) {
			if (err) throw err;
			res.redirect("/home/amis");
		});
	 
   }
};