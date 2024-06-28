const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const db = pgp("postgresql://postgres:Sanane132@localhost:6000/postgres");
const port = 5000;
const session = require("express-session");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

db.connect()
  .then(() => {
    console.log("PostgreSQL veritabanına bağlandı");
  })
  .catch((error) => {
    console.error("PostgreSQL bağlantı hatası:", error.message || error);
  });

let userData;

///LOGİN-REGİSTER////
app.post("/login", (req, res) => {
  const { user_mail, user_password } = req.body;
  console.log("user_mail: ", user_mail, "user_password: ", user_password);

  const query = {
    text: "SELECT user_id, user_name, user_mail, user_password, user_admin, user_bio FROM users WHERE user_mail = $1 AND user_password = $2",
    values: [user_mail, user_password],
  };

  db.query(query)
    .then((result) => {
      const isUserAuthenticated = result.length > 0;

      if (isUserAuthenticated) {
        userData = {
          user_id: result[0].user_id,
          user_name: result[0].user_name,
          user_mail: result[0].user_mail,
          user_password: result[0].user_password,
          user_bio: result[0].user_bio,
        };

        // Kontrol logları
        res.status(200).send(userData);
        req.session.user = userData;
      } else {
        res.status(401).send("Kullanıcı kimlik doğrulama hatası.");
      }
    })
    .catch((error) => {
      console.error(
        "Kullanıcı kimlik doğrulaması sırasında hata oluştu:",
        error
      );
      res
        .status(500)
        .send("Kullanıcı kimlik doğrulaması sırasında bir hata oluştu.");
    });
});
app.get("/oturumu-kapat", (req, res) => {
  if (userData) {
    userData = null;

    req.session.destroy((error) => {
      if (error) {
        console.error("Oturumu sonlandırma sırasında bir hata oluştu:", error);
        res.status(500).send("Oturumu sonlandırma sırasında bir hata oluştu.");
      } else {
        res.status(200).send("Oturum başarıyla sonlandırıldı.");
        console.log(userData);
      }
    });
  } else {
    res.status(200).send("Kullanıcı oturumu zaten kapalı.");
  }
});

app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  const query = {
    text: "INSERT INTO users (user_name, user_password,user_mail) VALUES($1, $2, $3)",
    values: [username, password, email],
  };

  db.query(query)
    .then(() => {
      res.status(201).send("Kullanıcı başarıyla kaydedildi.");
    })
    .catch((error) => {
      console.error("Kullanıcı kaydedilirken hata oluştu:", error);
      res.status(500).send("Kullanıcı kaydedilirken bir hata oluştu.");
    });
});
app.post("/update-bio", (req, res) => {
  const { user_id, bio } = req.body;

  // Update sorgusu
  const updateQuery = `
    UPDATE Users
    SET user_bio = $1
    WHERE user_id = $2;
  `;

  // Veritabanına sorguyu gönderme
  db.query(updateQuery, [bio, user_id])
    .then(() => {
      res.status(200).send("Biyografi başarıyla güncellendi.");
    })
    .catch((error) => {
      console.error("Biyografi güncellenirken hata oluştu:", error);
      res.status(500).send("Biyografi güncellenirken bir hata oluştu.");
    });
});

app.get("/currentUser", async (req, res) => {
  if (userData) {
    try {
      const data = await db.any(
        `SELECT * FROM users where user_id=${userData.user_id}`
      );
      res.json(data[0]);
    } catch (error) {
      console.error("kullanıcı bulunamadı");
    }
  }
});

//---------TABLO SORGULAMA MANTIĞI-----------//

app.get("/posts", async (req, res) => {
  try {
    const data = await db.any(`SELECT * FROM posts`);

    res.json(data);
  } catch (error) {
    console.error("Kullanıcı getirme hatası:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log(userData);
});
app.get("/users", async (req, res) => {
  try {
    const data = await db.any(`SELECT * FROM users`);

    res.json(data);
  } catch (error) {
    console.error("Kullanıcı getirme hatası:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log(userData);
});

app.get("/comments", async (req, res) => {
  try {
    const data = await db.any(`SELECT * FROM comments`);

    res.json(data);
  } catch (error) {
    console.error("Kullanıcı getirme hatası:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log(userData);
});
app.get("/flowdata", async (req, res) => {
  try {
    const data = await db.any(
      ` SELECT 
    p.post_id,
    p.post_content,
    TO_CHAR(p.post_date, 'YYYY-MM-DD') AS post_date,
    p.post_likes,
    pu.user_name AS post_sender_name,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'comment_id', c.comment_id,
            'comment_content', c.comment_content,
            'comment_sender_name', cu.user_name
        )
    ) AS comments
FROM 
    posts p
LEFT JOIN 
    comments c ON p.post_id = c.commentpost_id
LEFT JOIN 
    users cu ON c.comment_sender = cu.user_id
JOIN 
    users pu ON p.post_sender = pu.user_id
GROUP BY 
    p.post_id, pu.user_name, p.post_content, p.post_date, p.post_likes
ORDER BY 
    p.post_id DESC;



`
    );

    res.json(data);
  } catch (error) {
    console.error("Kullanıcı getirme hatası:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log(userData);
});
////OTHER-PROCESS//////////////////

app.post("/sendcomment", (req, res) => {
  const { comment_sender, comment_content, commentPost_id } = req.body;
  console.log("Gelen veri:", req.body);
  const query = {
    text: "INSERT INTO comments (comment_sender, comment_content, commentpost_id) VALUES ($1, $2, $3);",
    values: [comment_sender, comment_content, commentPost_id],
  };

  db.query(query)
    .then(() => {
      res.status(201).send("Yorum başarıyla kaydedildi.");
    })
    .catch((error) => {
      console.error("Yorum kaydedilirken hata oluştu:", error);
      res.status(500).send("Yorum kaydedilirken bir hata oluştu.");
    });
});

app.post("/sendpost", (req, res) => {
  const { post_sender, post_content } = req.body;

  const query = {
    text: "INSERT INTO posts (post_sender, post_content) VALUES($1, $2)",
    values: [post_sender, post_content],
  };

  db.query(query)
    .then(() => {
      res.status(201).send("Post başarıyla kaydedildi.");
    })
    .catch((error) => {
      console.error("Post kaydedilirken hata oluştu:", error);
      res.status(500).send("Post kaydedilirken bir hata oluştu.");
    });
});

app.get("/likes", async (req, res) => {
  try {
    const data = await db.any(`SELECT * FROM likes`);

    res.json(data);
  } catch (error) {
    console.error("Kullanıcı getirme hatası:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log(userData);
});

app.post("/likeupdate", (req, res) => {
  const { likeSender, post_id } = req.body;

  const updateQuery = `
  WITH UserLiked AS (
    SELECT
      post_id,
      post_likes @> ARRAY[$1::int] AS liked
    FROM Posts
    WHERE post_id = $2::int
  )
  UPDATE Posts
  SET post_likes = CASE
    WHEN liked THEN array_remove(post_likes, $1::int)
    ELSE array_append(post_likes, $1::int)
  END
  FROM UserLiked
  WHERE Posts.post_id = UserLiked.post_id;
  `;

  db.query(updateQuery, [parseInt(likeSender), parseInt(post_id)])
    .then(() => {
      res.status(201).send("Post başarıyla düzenlendi.");
    })
    .catch((error) => {
      console.error("Post kaydedilirken hata oluştu:", error);
      res.status(500).send("Post kaydedilirken bir hata oluştu.");
    });
});

app.listen(port, () => {
  console.log(`API çalışıyor: http://localhost:${port}`);
});
