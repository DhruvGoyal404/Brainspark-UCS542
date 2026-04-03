/**
 * DBMS QUIZZES SEED DATA
 * Contains Database Management System quizzes
 * Run: node seeds/quizzes-dbms.seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');

const dbmsQuizzes = [
    // ===== DBMS FUNDAMENTALS - EASY =====
    {
        id: 'dbms-basics',
        title: 'DBMS Basics',
        description: 'Introduction to Database Management Systems',
        category: 'dbms',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 20,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is a database?',
                options: [
                    { id: 'A', text: 'A collection of related data', isCorrect: true },
                    { id: 'B', text: 'A programming language', isCorrect: false },
                    { id: 'C', text: 'An operating system', isCorrect: false },
                    { id: 'D', text: 'A web browser', isCorrect: false }
                ],
                explanation: 'A database is an organized collection of structured data stored electronically.',
                difficulty: 'easy'
            },
            {
                questionText: 'What does DBMS stand for?',
                options: [
                    { id: 'A', text: 'Data Base Management System', isCorrect: true },
                    { id: 'B', text: 'Digital Base Management System', isCorrect: false },
                    { id: 'C', text: 'Data Backup Management System', isCorrect: false },
                    { id: 'D', text: 'Database Master System', isCorrect: false }
                ],
                explanation: 'DBMS stands for Database Management System - software to store, retrieve, and manage data.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is SQL?',
                options: [
                    { id: 'A', text: 'Structured Query Language', isCorrect: true },
                    { id: 'B', text: 'Simple Query Language', isCorrect: false },
                    { id: 'C', text: 'Standard Question Language', isCorrect: false },
                    { id: 'D', text: 'System Query Language', isCorrect: false }
                ],
                explanation: 'SQL (Structured Query Language) is the standard language for managing relational databases.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a primary key?',
                options: [
                    { id: 'A', text: 'Any column in a table', isCorrect: false },
                    { id: 'B', text: 'A unique identifier for each row', isCorrect: true },
                    { id: 'C', text: 'A password', isCorrect: false },
                    { id: 'D', text: 'The first column', isCorrect: false }
                ],
                explanation: 'A primary key uniquely identifies each record in a table and cannot be NULL.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a foreign key?',
                options: [
                    { id: 'A', text: 'A key from another country', isCorrect: false },
                    { id: 'B', text: 'A key that references a primary key in another table', isCorrect: true },
                    { id: 'C', text: 'An encryption key', isCorrect: false },
                    { id: 'D', text: 'A backup key', isCorrect: false }
                ],
                explanation: 'A foreign key creates a relationship between tables by referencing another table\'s primary key.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a table in DBMS?',
                options: [
                    { id: 'A', text: 'A piece of furniture', isCorrect: false },
                    { id: 'B', text: 'Collection of related data in rows and columns', isCorrect: true },
                    { id: 'C', text: 'A graph structure', isCorrect: false },
                    { id: 'D', text: 'A file system', isCorrect: false }
                ],
                explanation: 'A table (relation) organizes data in rows (tuples/records) and columns (attributes/fields).',
                difficulty: 'easy'
            },
            {
                questionText: 'What are rows in a table also called?',
                options: [
                    { id: 'A', text: 'Attributes', isCorrect: false },
                    { id: 'B', text: 'Tuples or Records', isCorrect: true },
                    { id: 'C', text: 'Fields', isCorrect: false },
                    { id: 'D', text: 'Domains', isCorrect: false }
                ],
                explanation: 'Rows are called tuples or records, representing a single data entry in a table.',
                difficulty: 'easy'
            },
            {
                questionText: 'What are columns in a table also called?',
                options: [
                    { id: 'A', text: 'Tuples', isCorrect: false },
                    { id: 'B', text: 'Records', isCorrect: false },
                    { id: 'C', text: 'Attributes or Fields', isCorrect: true },
                    { id: 'D', text: 'Rows', isCorrect: false }
                ],
                explanation: 'Columns are called attributes or fields, representing properties of data.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a schema?',
                options: [
                    { id: 'A', text: 'Data stored in tables', isCorrect: false },
                    { id: 'B', text: 'The structure/design of the database', isCorrect: true },
                    { id: 'C', text: 'A type of query', isCorrect: false },
                    { id: 'D', text: 'An error message', isCorrect: false }
                ],
                explanation: 'Schema defines the structure of a database - tables, columns, data types, and relationships.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which SQL command is used to retrieve data?',
                options: [
                    { id: 'A', text: 'INSERT', isCorrect: false },
                    { id: 'B', text: 'UPDATE', isCorrect: false },
                    { id: 'C', text: 'SELECT', isCorrect: true },
                    { id: 'D', text: 'DELETE', isCorrect: false }
                ],
                explanation: 'SELECT is used to query and retrieve data from one or more tables.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which SQL command adds new data?',
                options: [
                    { id: 'A', text: 'SELECT', isCorrect: false },
                    { id: 'B', text: 'INSERT', isCorrect: true },
                    { id: 'C', text: 'UPDATE', isCorrect: false },
                    { id: 'D', text: 'ALTER', isCorrect: false }
                ],
                explanation: 'INSERT is used to add new rows/records to a table.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a NULL value?',
                options: [
                    { id: 'A', text: 'Zero', isCorrect: false },
                    { id: 'B', text: 'Empty string', isCorrect: false },
                    { id: 'C', text: 'Unknown or missing value', isCorrect: true },
                    { id: 'D', text: 'False', isCorrect: false }
                ],
                explanation: 'NULL represents unknown, missing, or inapplicable data - not zero or empty string.',
                difficulty: 'easy'
            }
        ]
    },

    // ===== DBMS INTERMEDIATE - MEDIUM =====
    {
        id: 'dbms-fundamentals',
        title: 'DBMS Fundamentals',
        description: 'Test your database management knowledge',
        category: 'dbms',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What does ACID stand for in database transactions?',
                options: [
                    { id: 'A', text: 'Atomicity, Consistency, Isolation, Durability', isCorrect: true },
                    { id: 'B', text: 'Automatic, Complete, Independent, Dynamic', isCorrect: false },
                    { id: 'C', text: 'Active, Continuous, Immediate, Direct', isCorrect: false },
                    { id: 'D', text: 'Atomic, Complete, Immediate, Dynamic', isCorrect: false }
                ],
                explanation: 'ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is normalization in databases?',
                options: [
                    { id: 'A', text: 'Adding more data to tables', isCorrect: false },
                    { id: 'B', text: 'Organizing data to reduce redundancy', isCorrect: true },
                    { id: 'C', text: 'Deleting all tables', isCorrect: false },
                    { id: 'D', text: 'Making all columns nullable', isCorrect: false }
                ],
                explanation: 'Normalization is the process of organizing data to minimize redundancy and dependency.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is SQL injection?',
                options: [
                    { id: 'A', text: 'A way to speed up queries', isCorrect: false },
                    { id: 'B', text: 'A security vulnerability where malicious SQL is inserted', isCorrect: true },
                    { id: 'C', text: 'A database optimization technique', isCorrect: false },
                    { id: 'D', text: 'A type of index', isCorrect: false }
                ],
                explanation: 'SQL injection is a code injection technique that exploits security vulnerabilities.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the purpose of an index in a database?',
                options: [
                    { id: 'A', text: 'To delete data faster', isCorrect: false },
                    { id: 'B', text: 'To speed up data retrieval', isCorrect: true },
                    { id: 'C', text: 'To encrypt data', isCorrect: false },
                    { id: 'D', text: 'To compress data', isCorrect: false }
                ],
                explanation: 'Indexes improve the speed of data retrieval operations on a database table.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between DELETE and TRUNCATE?',
                options: [
                    { id: 'A', text: 'There is no difference', isCorrect: false },
                    { id: 'B', text: 'DELETE can have WHERE clause, TRUNCATE removes all rows', isCorrect: true },
                    { id: 'C', text: 'TRUNCATE is slower', isCorrect: false },
                    { id: 'D', text: 'DELETE is DDL, TRUNCATE is DML', isCorrect: false }
                ],
                explanation: 'DELETE is DML (can use WHERE), TRUNCATE is DDL (removes all rows quickly, cannot rollback).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a stored procedure?',
                options: [
                    { id: 'A', text: 'A backup of the database', isCorrect: false },
                    { id: 'B', text: 'A precompiled collection of SQL statements', isCorrect: true },
                    { id: 'C', text: 'A type of table', isCorrect: false },
                    { id: 'D', text: 'A database user', isCorrect: false }
                ],
                explanation: 'A stored procedure is a prepared SQL code that you can save and reuse.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is 3NF (Third Normal Form)?',
                options: [
                    { id: 'A', text: 'Table has a primary key', isCorrect: false },
                    { id: 'B', text: 'No transitive dependency and is in 2NF', isCorrect: true },
                    { id: 'C', text: 'All columns are indexed', isCorrect: false },
                    { id: 'D', text: 'Table has exactly 3 columns', isCorrect: false }
                ],
                explanation: '3NF: No transitive dependencies (non-key depends only on key), and table is in 2NF.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a view in SQL?',
                options: [
                    { id: 'A', text: 'A physical table', isCorrect: false },
                    { id: 'B', text: 'A virtual table based on a SELECT query', isCorrect: true },
                    { id: 'C', text: 'A backup', isCorrect: false },
                    { id: 'D', text: 'An index', isCorrect: false }
                ],
                explanation: 'A view is a virtual table based on the result set of a SELECT statement.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a JOIN operation?',
                options: [
                    { id: 'A', text: 'Deleting tables', isCorrect: false },
                    { id: 'B', text: 'Combining rows from two or more tables', isCorrect: true },
                    { id: 'C', text: 'Creating new tables', isCorrect: false },
                    { id: 'D', text: 'Sorting data', isCorrect: false }
                ],
                explanation: 'JOIN combines rows from two or more tables based on a related column.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a LEFT JOIN?',
                options: [
                    { id: 'A', text: 'Returns only matching rows', isCorrect: false },
                    { id: 'B', text: 'Returns all rows from left table and matched rows from right', isCorrect: true },
                    { id: 'C', text: 'Returns all rows from right table', isCorrect: false },
                    { id: 'D', text: 'Returns the leftmost column', isCorrect: false }
                ],
                explanation: 'LEFT JOIN returns all records from left table with matched records from right (NULL if no match).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the difference between DDL and DML?',
                options: [
                    { id: 'A', text: 'DDL defines structure, DML manipulates data', isCorrect: true },
                    { id: 'B', text: 'They are the same', isCorrect: false },
                    { id: 'C', text: 'DDL is faster', isCorrect: false },
                    { id: 'D', text: 'DML creates tables', isCorrect: false }
                ],
                explanation: 'DDL (CREATE, ALTER, DROP) defines structure; DML (SELECT, INSERT, UPDATE, DELETE) manipulates data.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a transaction?',
                options: [
                    { id: 'A', text: 'A single SQL statement', isCorrect: false },
                    { id: 'B', text: 'A unit of work that is atomic', isCorrect: true },
                    { id: 'C', text: 'A database backup', isCorrect: false },
                    { id: 'D', text: 'A table creation', isCorrect: false }
                ],
                explanation: 'A transaction is a sequence of operations performed as a single logical unit of work.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the GROUP BY clause used for?',
                options: [
                    { id: 'A', text: 'Sorting data', isCorrect: false },
                    { id: 'B', text: 'Grouping rows with same values for aggregate functions', isCorrect: true },
                    { id: 'C', text: 'Joining tables', isCorrect: false },
                    { id: 'D', text: 'Filtering rows', isCorrect: false }
                ],
                explanation: 'GROUP BY groups rows with same values, often used with aggregate functions (COUNT, SUM, AVG).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the HAVING clause?',
                options: [
                    { id: 'A', text: 'Same as WHERE', isCorrect: false },
                    { id: 'B', text: 'Filters groups after GROUP BY', isCorrect: true },
                    { id: 'C', text: 'Sorts the result', isCorrect: false },
                    { id: 'D', text: 'Creates indexes', isCorrect: false }
                ],
                explanation: 'HAVING filters groups after GROUP BY, while WHERE filters rows before grouping.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is denormalization?',
                options: [
                    { id: 'A', text: 'Removing data', isCorrect: false },
                    { id: 'B', text: 'Intentionally adding redundancy for performance', isCorrect: true },
                    { id: 'C', text: 'Deleting indexes', isCorrect: false },
                    { id: 'D', text: 'Encrypting data', isCorrect: false }
                ],
                explanation: 'Denormalization adds redundancy to improve read performance at cost of write complexity.',
                difficulty: 'hard'
            }
        ]
    },

    // ===== SQL ADVANCED - HARD =====
    {
        id: 'sql-advanced',
        title: 'Advanced SQL',
        description: 'Master complex SQL queries and concepts',
        category: 'dbms',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is a subquery?',
                options: [
                    { id: 'A', text: 'A query with errors', isCorrect: false },
                    { id: 'B', text: 'A query nested inside another query', isCorrect: true },
                    { id: 'C', text: 'A fast query', isCorrect: false },
                    { id: 'D', text: 'A backup query', isCorrect: false }
                ],
                explanation: 'A subquery is a query nested inside another query (SELECT, INSERT, UPDATE, DELETE).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a correlated subquery?',
                options: [
                    { id: 'A', text: 'A subquery that runs once', isCorrect: false },
                    { id: 'B', text: 'A subquery that references outer query', isCorrect: true },
                    { id: 'C', text: 'A subquery with errors', isCorrect: false },
                    { id: 'D', text: 'A fast subquery', isCorrect: false }
                ],
                explanation: 'Correlated subquery references columns from outer query and executes for each outer row.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a CTE (Common Table Expression)?',
                options: [
                    { id: 'A', text: 'A permanent table', isCorrect: false },
                    { id: 'B', text: 'A named temporary result set', isCorrect: true },
                    { id: 'C', text: 'A type of index', isCorrect: false },
                    { id: 'D', text: 'A constraint', isCorrect: false }
                ],
                explanation: 'CTE is a temporary named result set defined within WITH clause, existing only during query execution.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the difference between UNION and UNION ALL?',
                options: [
                    { id: 'A', text: 'They are identical', isCorrect: false },
                    { id: 'B', text: 'UNION removes duplicates, UNION ALL keeps all', isCorrect: true },
                    { id: 'C', text: 'UNION ALL is slower', isCorrect: false },
                    { id: 'D', text: 'UNION combines columns', isCorrect: false }
                ],
                explanation: 'UNION removes duplicate rows (slower), UNION ALL keeps all rows including duplicates.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a window function?',
                options: [
                    { id: 'A', text: 'Function that opens a window', isCorrect: false },
                    { id: 'B', text: 'Function that performs calculation across row set', isCorrect: true },
                    { id: 'C', text: 'A type of join', isCorrect: false },
                    { id: 'D', text: 'A filter function', isCorrect: false }
                ],
                explanation: 'Window functions perform calculations across a set of rows related to current row (ROW_NUMBER, RANK, SUM OVER).',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the difference between RANK() and DENSE_RANK()?',
                options: [
                    { id: 'A', text: 'They are identical', isCorrect: false },
                    { id: 'B', text: 'RANK skips numbers after ties, DENSE_RANK does not', isCorrect: true },
                    { id: 'C', text: 'DENSE_RANK is slower', isCorrect: false },
                    { id: 'D', text: 'RANK is for text only', isCorrect: false }
                ],
                explanation: 'RANK: 1,1,3,4 (skips 2 after tie), DENSE_RANK: 1,1,2,3 (no gaps).',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a clustered index?',
                options: [
                    { id: 'A', text: 'Multiple indexes together', isCorrect: false },
                    { id: 'B', text: 'Index that determines physical order of data', isCorrect: true },
                    { id: 'C', text: 'A backup index', isCorrect: false },
                    { id: 'D', text: 'A temporary index', isCorrect: false }
                ],
                explanation: 'Clustered index sorts and stores data rows based on key values. Only one per table.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is database sharding?',
                options: [
                    { id: 'A', text: 'Deleting old data', isCorrect: false },
                    { id: 'B', text: 'Splitting database across multiple machines', isCorrect: true },
                    { id: 'C', text: 'Encrypting database', isCorrect: false },
                    { id: 'D', text: 'Backing up database', isCorrect: false }
                ],
                explanation: 'Sharding horizontally partitions data across multiple database instances for scalability.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is BCNF (Boyce-Codd Normal Form)?',
                options: [
                    { id: 'A', text: 'Same as 3NF', isCorrect: false },
                    { id: 'B', text: 'Stricter version of 3NF', isCorrect: true },
                    { id: 'C', text: 'First normal form', isCorrect: false },
                    { id: 'D', text: 'A backup format', isCorrect: false }
                ],
                explanation: 'BCNF is stricter than 3NF: every determinant must be a candidate key.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a trigger?',
                options: [
                    { id: 'A', text: 'A button in the UI', isCorrect: false },
                    { id: 'B', text: 'Automatic SQL execution on table events', isCorrect: true },
                    { id: 'C', text: 'A type of index', isCorrect: false },
                    { id: 'D', text: 'A backup mechanism', isCorrect: false }
                ],
                explanation: 'Trigger is SQL code automatically executed when specific table events (INSERT, UPDATE, DELETE) occur.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a deadlock in database context?',
                options: [
                    { id: 'A', text: 'Database crash', isCorrect: false },
                    { id: 'B', text: 'Transactions waiting for each other\'s locks', isCorrect: true },
                    { id: 'C', text: 'Table is full', isCorrect: false },
                    { id: 'D', text: 'Connection timeout', isCorrect: false }
                ],
                explanation: 'Deadlock: two transactions each waiting for a lock held by the other, causing indefinite wait.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the difference between optimistic and pessimistic locking?',
                options: [
                    { id: 'A', text: 'They are the same', isCorrect: false },
                    { id: 'B', text: 'Pessimistic locks early, optimistic checks at commit', isCorrect: true },
                    { id: 'C', text: 'Optimistic is always better', isCorrect: false },
                    { id: 'D', text: 'Pessimistic is faster', isCorrect: false }
                ],
                explanation: 'Pessimistic: lock before reading. Optimistic: no lock, check for conflicts at commit time.',
                difficulty: 'hard'
            }
        ]
    },

    // ===== TRANSACTIONS AND CONCURRENCY - HARD =====
    {
        id: 'dbms-transactions',
        title: 'Transactions & Concurrency',
        description: 'Master transaction management and concurrency control',
        category: 'dbms',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is atomicity in ACID?',
                options: [
                    { id: 'A', text: 'Transaction is very small', isCorrect: false },
                    { id: 'B', text: 'Transaction executes completely or not at all', isCorrect: true },
                    { id: 'C', text: 'Transaction is fast', isCorrect: false },
                    { id: 'D', text: 'Transaction uses atoms', isCorrect: false }
                ],
                explanation: 'Atomicity ensures a transaction is all-or-nothing: either all operations succeed or none do.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is consistency in ACID?',
                options: [
                    { id: 'A', text: 'Data is always the same', isCorrect: false },
                    { id: 'B', text: 'Transaction brings database from one valid state to another', isCorrect: true },
                    { id: 'C', text: 'All transactions are consistent', isCorrect: false },
                    { id: 'D', text: 'Data never changes', isCorrect: false }
                ],
                explanation: 'Consistency ensures database constraints are maintained before and after transaction.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is isolation in ACID?',
                options: [
                    { id: 'A', text: 'Transactions run alone', isCorrect: false },
                    { id: 'B', text: 'Concurrent transactions don\'t interfere with each other', isCorrect: true },
                    { id: 'C', text: 'Database is isolated from network', isCorrect: false },
                    { id: 'D', text: 'Only one transaction allowed', isCorrect: false }
                ],
                explanation: 'Isolation ensures concurrent transactions execute as if they were running sequentially.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is durability in ACID?',
                options: [
                    { id: 'A', text: 'Transaction takes a long time', isCorrect: false },
                    { id: 'B', text: 'Committed changes persist even after failure', isCorrect: true },
                    { id: 'C', text: 'Database is durable hardware', isCorrect: false },
                    { id: 'D', text: 'Transaction never fails', isCorrect: false }
                ],
                explanation: 'Durability ensures once a transaction is committed, changes persist even after system failure.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a dirty read?',
                options: [
                    { id: 'A', text: 'Reading corrupted data', isCorrect: false },
                    { id: 'B', text: 'Reading uncommitted data from another transaction', isCorrect: true },
                    { id: 'C', text: 'Reading old data', isCorrect: false },
                    { id: 'D', text: 'Reading encrypted data', isCorrect: false }
                ],
                explanation: 'Dirty read: reading data modified by an uncommitted transaction (might be rolled back).',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a non-repeatable read?',
                options: [
                    { id: 'A', text: 'Reading data only once', isCorrect: false },
                    { id: 'B', text: 'Getting different values when reading same row twice', isCorrect: true },
                    { id: 'C', text: 'Reading unique data', isCorrect: false },
                    { id: 'D', text: 'Reading NULL values', isCorrect: false }
                ],
                explanation: 'Non-repeatable read: re-reading a row gives different values because another transaction modified it.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a phantom read?',
                options: [
                    { id: 'A', text: 'Reading ghost data', isCorrect: false },
                    { id: 'B', text: 'New rows appearing in repeated query due to other transaction', isCorrect: true },
                    { id: 'C', text: 'Reading deleted data', isCorrect: false },
                    { id: 'D', text: 'Reading invisible data', isCorrect: false }
                ],
                explanation: 'Phantom read: re-executing a query returns new rows because another transaction inserted them.',
                difficulty: 'hard'
            },
            {
                questionText: 'Which isolation level prevents dirty reads only?',
                options: [
                    { id: 'A', text: 'Read Uncommitted', isCorrect: false },
                    { id: 'B', text: 'Read Committed', isCorrect: true },
                    { id: 'C', text: 'Repeatable Read', isCorrect: false },
                    { id: 'D', text: 'Serializable', isCorrect: false }
                ],
                explanation: 'Read Committed prevents dirty reads but allows non-repeatable and phantom reads.',
                difficulty: 'hard'
            },
            {
                questionText: 'Which isolation level prevents all read phenomena?',
                options: [
                    { id: 'A', text: 'Read Uncommitted', isCorrect: false },
                    { id: 'B', text: 'Read Committed', isCorrect: false },
                    { id: 'C', text: 'Repeatable Read', isCorrect: false },
                    { id: 'D', text: 'Serializable', isCorrect: true }
                ],
                explanation: 'Serializable is the strictest level, preventing all read phenomena but with lowest concurrency.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is two-phase locking (2PL)?',
                options: [
                    { id: 'A', text: 'Locking two tables', isCorrect: false },
                    { id: 'B', text: 'Growing phase (acquire locks) then shrinking phase (release)', isCorrect: true },
                    { id: 'C', text: 'Two types of locks', isCorrect: false },
                    { id: 'D', text: 'Locking twice', isCorrect: false }
                ],
                explanation: '2PL: transaction acquires all locks before releasing any, ensuring serializability.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is MVCC (Multi-Version Concurrency Control)?',
                options: [
                    { id: 'A', text: 'Multiple database versions', isCorrect: false },
                    { id: 'B', text: 'Maintaining multiple versions of data for concurrent access', isCorrect: true },
                    { id: 'C', text: 'Version control for code', isCorrect: false },
                    { id: 'D', text: 'Multiple connections', isCorrect: false }
                ],
                explanation: 'MVCC keeps multiple versions of data, allowing reads without blocking writes.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a savepoint?',
                options: [
                    { id: 'A', text: 'A backup location', isCorrect: false },
                    { id: 'B', text: 'A point within transaction to partially rollback to', isCorrect: true },
                    { id: 'C', text: 'A commit point', isCorrect: false },
                    { id: 'D', text: 'A recovery point', isCorrect: false }
                ],
                explanation: 'Savepoint marks a point in transaction to which you can later rollback without aborting entire transaction.',
                difficulty: 'medium'
            }
        ]
    }
];

const seedDBMSQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = await User.create({
                username: 'admin',
                email: 'admin@brainspark.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        await Quiz.deleteMany({ category: 'dbms' });
        console.log('🗑️  Cleared existing DBMS quizzes');

        const quizzesWithCreator = dbmsQuizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        const totalQuestions = dbmsQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        console.log(`✅ Seeded ${dbmsQuizzes.length} DBMS quizzes with ${totalQuestions} total questions!`);
        console.log('\n📊 DBMS Quiz Summary:');
        dbmsQuizzes.forEach(quiz => {
            console.log(`   - ${quiz.title}: ${quiz.questions.length} questions (${quiz.difficulty})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding DBMS quizzes:', error);
        process.exit(1);
    }
};

seedDBMSQuizzes();
