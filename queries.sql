-- Получить список всех категорий
SELECT * FROM categories

-- Получить список категорий, для которых создана минимум одна публикация
SELECT id, name FROM categories
  JOIN aricle_categories
  ON id = category_id
  GROUP BY id

-- Получить список категорий с количеством публикаций
SELECT id, name, COUNT(category_id) FROM categories
  LEFT JOIN aricle_categories
  ON id = category_id
  GROUP BY id

-- Получить список публикаций. Сначала свежие публикации
SELECT articles.*,
  COUNT(comments.id) as commnts_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.name,
  users.email
FROM articles
  JOIN aricle_categories ON articles.id = aricle_categories.article_id
  JOIN categories ON aricle_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN user ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC

-- Получить полную информацию определённой публикации
SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.name,
  users.email
  FROM articles
    JOIN aricle_categories ON articles.id = aricle_categories.article_id
    JOIN categories ON aricle_categories.category_id = categories.id
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN user ON users.id = articles.user_id
  WHERE articles.id = 1
    GROUP BY articles.id, users.id

-- Получить список из 5 свежих комментариев
SELECT
  comments.id,
  comments.article_id,
  comments.text,
  users.name
FROM comments
  JOIN users ON comments.user_id = users.id
ORDER BY comments.created_at DESC
  LIMIT 5

-- Получить список комментариев для определённой публикации
SELECT
  comments.id,
  comments.article_id,
  comments.text,
  users.name
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.created_at DESC

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»
UPDATE articles
  SET title = 'Как я встретил Новый год'
  WHERE id = 1
