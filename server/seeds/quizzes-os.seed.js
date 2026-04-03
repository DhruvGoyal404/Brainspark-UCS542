/**
 * OPERATING SYSTEMS QUIZZES SEED DATA
 * Contains OS and Systems quizzes
 * Run: node seeds/quizzes-os.seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');

const osQuizzes = [
    // ===== OS FUNDAMENTALS - MEDIUM =====
    {
        id: 'operating-systems',
        title: 'Operating Systems Fundamentals',
        description: 'Master the fundamentals of operating systems',
        category: 'operating-systems',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is a process in an operating system?',
                options: [
                    { id: 'A', text: 'A program in execution', isCorrect: true },
                    { id: 'B', text: 'A stored program on disk', isCorrect: false },
                    { id: 'C', text: 'A system call', isCorrect: false },
                    { id: 'D', text: 'A hardware component', isCorrect: false }
                ],
                explanation: 'A process is an instance of a program that is being executed, including code, data, and resources.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between a process and a thread?',
                options: [
                    { id: 'A', text: 'Threads share the same memory space, processes do not', isCorrect: true },
                    { id: 'B', text: 'Processes are faster than threads', isCorrect: false },
                    { id: 'C', text: 'Threads cannot communicate with each other', isCorrect: false },
                    { id: 'D', text: 'There is no difference', isCorrect: false }
                ],
                explanation: 'Threads within the same process share memory and resources, while processes have separate address spaces.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a deadlock in operating systems?',
                options: [
                    { id: 'A', text: 'When a process finishes execution', isCorrect: false },
                    { id: 'B', text: 'When processes wait indefinitely for resources held by each other', isCorrect: true },
                    { id: 'C', text: 'When CPU is idle', isCorrect: false },
                    { id: 'D', text: 'When memory is full', isCorrect: false }
                ],
                explanation: 'Deadlock occurs when two or more processes are waiting for each other to release resources, creating a circular wait.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which scheduling algorithm gives minimum average waiting time?',
                options: [
                    { id: 'A', text: 'FCFS (First Come First Serve)', isCorrect: false },
                    { id: 'B', text: 'SJF (Shortest Job First)', isCorrect: true },
                    { id: 'C', text: 'Round Robin', isCorrect: false },
                    { id: 'D', text: 'Priority Scheduling', isCorrect: false }
                ],
                explanation: 'SJF is proven to give the minimum average waiting time for a given set of processes.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is virtual memory?',
                options: [
                    { id: 'A', text: 'Physical RAM only', isCorrect: false },
                    { id: 'B', text: 'A memory management technique using both RAM and disk', isCorrect: true },
                    { id: 'C', text: 'Cache memory', isCorrect: false },
                    { id: 'D', text: 'ROM memory', isCorrect: false }
                ],
                explanation: 'Virtual memory allows running programs larger than physical RAM by using disk space as extension.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a page fault?',
                options: [
                    { id: 'A', text: 'When a page is corrupted', isCorrect: false },
                    { id: 'B', text: 'When a requested page is not in main memory', isCorrect: true },
                    { id: 'C', text: 'When memory is full', isCorrect: false },
                    { id: 'D', text: 'When a process terminates', isCorrect: false }
                ],
                explanation: 'A page fault occurs when a process accesses a page not currently in physical RAM.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which of the following is NOT a necessary condition for deadlock?',
                options: [
                    { id: 'A', text: 'Mutual Exclusion', isCorrect: false },
                    { id: 'B', text: 'Hold and Wait', isCorrect: false },
                    { id: 'C', text: 'Preemption', isCorrect: true },
                    { id: 'D', text: 'Circular Wait', isCorrect: false }
                ],
                explanation: 'The four conditions are: Mutual Exclusion, Hold and Wait, NO Preemption, and Circular Wait.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is thrashing?',
                options: [
                    { id: 'A', text: 'High CPU utilization', isCorrect: false },
                    { id: 'B', text: 'Excessive paging causing low CPU utilization', isCorrect: true },
                    { id: 'C', text: 'Fast process execution', isCorrect: false },
                    { id: 'D', text: 'Memory leak', isCorrect: false }
                ],
                explanation: 'Thrashing occurs when the system spends more time paging than executing useful work.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the purpose of a semaphore?',
                options: [
                    { id: 'A', text: 'To speed up processes', isCorrect: false },
                    { id: 'B', text: 'To synchronize concurrent processes', isCorrect: true },
                    { id: 'C', text: 'To allocate memory', isCorrect: false },
                    { id: 'D', text: 'To manage files', isCorrect: false }
                ],
                explanation: 'Semaphores are synchronization primitives used to control access to shared resources.',
                difficulty: 'medium'
            },
            {
                questionText: "Which page replacement algorithm suffers from Belady's Anomaly?",
                options: [
                    { id: 'A', text: 'LRU', isCorrect: false },
                    { id: 'B', text: 'Optimal', isCorrect: false },
                    { id: 'C', text: 'FIFO', isCorrect: true },
                    { id: 'D', text: 'LFU', isCorrect: false }
                ],
                explanation: "FIFO can have more page faults with more frames, known as Belady's Anomaly.",
                difficulty: 'hard'
            },
            {
                questionText: 'What are the states of a process?',
                options: [
                    { id: 'A', text: 'Start, Stop', isCorrect: false },
                    { id: 'B', text: 'New, Ready, Running, Waiting, Terminated', isCorrect: true },
                    { id: 'C', text: 'Active, Inactive', isCorrect: false },
                    { id: 'D', text: 'On, Off, Paused', isCorrect: false }
                ],
                explanation: 'A process goes through New → Ready → Running → (Waiting ↔ Running) → Terminated states.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is context switching?',
                options: [
                    { id: 'A', text: 'Switching between windows', isCorrect: false },
                    { id: 'B', text: 'Saving and restoring process state when switching processes', isCorrect: true },
                    { id: 'C', text: 'Changing CPU frequency', isCorrect: false },
                    { id: 'D', text: 'Updating file system', isCorrect: false }
                ],
                explanation: 'Context switching saves the state of current process and loads the state of another process.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the PCB (Process Control Block)?',
                options: [
                    { id: 'A', text: 'A circuit board', isCorrect: false },
                    { id: 'B', text: 'Data structure containing process information', isCorrect: true },
                    { id: 'C', text: 'A type of memory', isCorrect: false },
                    { id: 'D', text: 'A scheduling algorithm', isCorrect: false }
                ],
                explanation: 'PCB contains process state, program counter, CPU registers, memory info, I/O status, etc.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a critical section?',
                options: [
                    { id: 'A', text: 'Important code in a program', isCorrect: false },
                    { id: 'B', text: 'Code segment that accesses shared resources', isCorrect: true },
                    { id: 'C', text: 'Error handling code', isCorrect: false },
                    { id: 'D', text: 'Main function of program', isCorrect: false }
                ],
                explanation: 'Critical section is code that accesses shared resources and must be executed atomically.',
                difficulty: 'medium'
            },
            {
                questionText: 'What does the fork() system call do?',
                options: [
                    { id: 'A', text: 'Creates a new thread', isCorrect: false },
                    { id: 'B', text: 'Creates a new child process', isCorrect: true },
                    { id: 'C', text: 'Terminates a process', isCorrect: false },
                    { id: 'D', text: 'Allocates memory', isCorrect: false }
                ],
                explanation: 'fork() creates a new child process that is a copy of the parent process.',
                difficulty: 'medium'
            }
        ]
    },

    // ===== PROCESS MANAGEMENT - MEDIUM =====
    {
        id: 'os-process-management',
        title: 'Process Management',
        description: 'Deep dive into process scheduling and management',
        category: 'operating-systems',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is the time quantum in Round Robin scheduling?',
                options: [
                    { id: 'A', text: 'Maximum CPU time for a process', isCorrect: false },
                    { id: 'B', text: 'Fixed time slice given to each process', isCorrect: true },
                    { id: 'C', text: 'Total execution time', isCorrect: false },
                    { id: 'D', text: 'Waiting time', isCorrect: false }
                ],
                explanation: 'Time quantum is the fixed time slice each process gets before being preempted in Round Robin.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is starvation in process scheduling?',
                options: [
                    { id: 'A', text: 'Process running out of memory', isCorrect: false },
                    { id: 'B', text: 'Process waiting indefinitely for CPU', isCorrect: true },
                    { id: 'C', text: 'Process termination', isCorrect: false },
                    { id: 'D', text: 'Process deadlock', isCorrect: false }
                ],
                explanation: 'Starvation occurs when a process waits indefinitely because higher priority processes keep getting CPU.',
                difficulty: 'medium'
            },
            {
                questionText: 'How can starvation be prevented?',
                options: [
                    { id: 'A', text: 'By using FCFS only', isCorrect: false },
                    { id: 'B', text: 'By aging - gradually increasing priority of waiting processes', isCorrect: true },
                    { id: 'C', text: 'By killing long-running processes', isCorrect: false },
                    { id: 'D', text: 'By using only one process', isCorrect: false }
                ],
                explanation: 'Aging increases priority of waiting processes over time, eventually giving them CPU access.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the convoy effect?',
                options: [
                    { id: 'A', text: 'Multiple processes running together', isCorrect: false },
                    { id: 'B', text: 'Short processes waiting behind long process in FCFS', isCorrect: true },
                    { id: 'C', text: 'Processes moving in parallel', isCorrect: false },
                    { id: 'D', text: 'CPU becoming faster', isCorrect: false }
                ],
                explanation: 'Convoy effect in FCFS: many short processes wait behind one long process, increasing average waiting time.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is preemptive scheduling?',
                options: [
                    { id: 'A', text: 'Process runs until completion', isCorrect: false },
                    { id: 'B', text: 'Process can be interrupted and moved to ready queue', isCorrect: true },
                    { id: 'C', text: 'Only one process can run', isCorrect: false },
                    { id: 'D', text: 'No scheduling at all', isCorrect: false }
                ],
                explanation: 'In preemptive scheduling, a running process can be interrupted to give CPU to another process.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which scheduling is non-preemptive?',
                options: [
                    { id: 'A', text: 'Round Robin', isCorrect: false },
                    { id: 'B', text: 'Shortest Remaining Time First', isCorrect: false },
                    { id: 'C', text: 'First Come First Serve', isCorrect: true },
                    { id: 'D', text: 'Priority Preemptive', isCorrect: false }
                ],
                explanation: 'FCFS is non-preemptive - once a process gets CPU, it runs until completion or I/O.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is turnaround time?',
                options: [
                    { id: 'A', text: 'Time process spends in CPU', isCorrect: false },
                    { id: 'B', text: 'Total time from submission to completion', isCorrect: true },
                    { id: 'C', text: 'Time waiting in queue', isCorrect: false },
                    { id: 'D', text: 'Time for I/O operations', isCorrect: false }
                ],
                explanation: 'Turnaround time = Completion time - Arrival time. Total time process spends in system.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the formula for Waiting Time?',
                options: [
                    { id: 'A', text: 'Turnaround Time + Burst Time', isCorrect: false },
                    { id: 'B', text: 'Turnaround Time - Burst Time', isCorrect: true },
                    { id: 'C', text: 'Burst Time - Arrival Time', isCorrect: false },
                    { id: 'D', text: 'Completion Time only', isCorrect: false }
                ],
                explanation: 'Waiting Time = Turnaround Time - Burst Time. Time spent waiting for CPU.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a long-term scheduler (job scheduler)?',
                options: [
                    { id: 'A', text: 'Schedules which process gets CPU next', isCorrect: false },
                    { id: 'B', text: 'Decides which jobs are admitted to system', isCorrect: true },
                    { id: 'C', text: 'Handles swapping', isCorrect: false },
                    { id: 'D', text: 'Manages I/O scheduling', isCorrect: false }
                ],
                explanation: 'Long-term scheduler controls the degree of multiprogramming by admitting processes to ready queue.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the short-term scheduler?',
                options: [
                    { id: 'A', text: 'Admits jobs to system', isCorrect: false },
                    { id: 'B', text: 'CPU scheduler that picks process to run next', isCorrect: true },
                    { id: 'C', text: 'Handles memory allocation', isCorrect: false },
                    { id: 'D', text: 'Manages file system', isCorrect: false }
                ],
                explanation: 'Short-term scheduler (CPU scheduler) selects which ready process gets CPU next.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is response time?',
                options: [
                    { id: 'A', text: 'Total execution time', isCorrect: false },
                    { id: 'B', text: 'Time from submission to first response', isCorrect: true },
                    { id: 'C', text: 'Time to complete I/O', isCorrect: false },
                    { id: 'D', text: 'Waiting time', isCorrect: false }
                ],
                explanation: 'Response time is the time from when a request was submitted until the first response is produced.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which is the best scheduling algorithm for time-sharing systems?',
                options: [
                    { id: 'A', text: 'FCFS', isCorrect: false },
                    { id: 'B', text: 'SJF', isCorrect: false },
                    { id: 'C', text: 'Round Robin', isCorrect: true },
                    { id: 'D', text: 'Priority Non-preemptive', isCorrect: false }
                ],
                explanation: 'Round Robin is ideal for time-sharing as it gives each process fair CPU time.',
                difficulty: 'easy'
            }
        ]
    },

    // ===== MEMORY MANAGEMENT - HARD =====
    {
        id: 'os-memory-management',
        title: 'Memory Management',
        description: 'Advanced concepts in OS memory management',
        category: 'operating-systems',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is internal fragmentation?',
                options: [
                    { id: 'A', text: 'Unused memory between allocated blocks', isCorrect: false },
                    { id: 'B', text: 'Wasted memory inside an allocated block', isCorrect: true },
                    { id: 'C', text: 'Memory corruption', isCorrect: false },
                    { id: 'D', text: 'Memory overflow', isCorrect: false }
                ],
                explanation: 'Internal fragmentation occurs when allocated memory block is larger than requested, wasting space inside.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is external fragmentation?',
                options: [
                    { id: 'A', text: 'Wasted memory inside blocks', isCorrect: false },
                    { id: 'B', text: 'Free memory scattered in small non-contiguous blocks', isCorrect: true },
                    { id: 'C', text: 'Memory outside RAM', isCorrect: false },
                    { id: 'D', text: 'Corrupted memory', isCorrect: false }
                ],
                explanation: 'External fragmentation: total free memory is enough but scattered, cannot satisfy large request.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which technique eliminates external fragmentation?',
                options: [
                    { id: 'A', text: 'First Fit allocation', isCorrect: false },
                    { id: 'B', text: 'Paging', isCorrect: true },
                    { id: 'C', text: 'Best Fit allocation', isCorrect: false },
                    { id: 'D', text: 'Worst Fit allocation', isCorrect: false }
                ],
                explanation: 'Paging divides memory into fixed-size frames, eliminating external fragmentation.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a page table?',
                options: [
                    { id: 'A', text: 'Table of disk pages', isCorrect: false },
                    { id: 'B', text: 'Maps virtual page numbers to physical frame numbers', isCorrect: true },
                    { id: 'C', text: 'List of processes', isCorrect: false },
                    { id: 'D', text: 'Memory allocation table', isCorrect: false }
                ],
                explanation: 'Page table maps each virtual page of a process to a physical frame in memory.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is TLB (Translation Lookaside Buffer)?',
                options: [
                    { id: 'A', text: 'A type of RAM', isCorrect: false },
                    { id: 'B', text: 'Cache for page table entries', isCorrect: true },
                    { id: 'C', text: 'Disk buffer', isCorrect: false },
                    { id: 'D', text: 'CPU register', isCorrect: false }
                ],
                explanation: 'TLB is a fast cache that stores recent page table entries for quick address translation.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is demand paging?',
                options: [
                    { id: 'A', text: 'Loading all pages at start', isCorrect: false },
                    { id: 'B', text: 'Loading pages only when needed (on demand)', isCorrect: true },
                    { id: 'C', text: 'Deleting unused pages', isCorrect: false },
                    { id: 'D', text: 'Sorting pages', isCorrect: false }
                ],
                explanation: 'Demand paging loads pages into memory only when they are accessed, saving memory.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the optimal page replacement algorithm?',
                options: [
                    { id: 'A', text: 'Replace the oldest page', isCorrect: false },
                    { id: 'B', text: 'Replace page that will not be used for longest time', isCorrect: true },
                    { id: 'C', text: 'Replace randomly', isCorrect: false },
                    { id: 'D', text: 'Replace most recently used', isCorrect: false }
                ],
                explanation: 'Optimal algorithm replaces the page that will not be used for the longest time in future.',
                difficulty: 'medium'
            },
            {
                questionText: 'Why is optimal page replacement not practical?',
                options: [
                    { id: 'A', text: 'It is too slow', isCorrect: false },
                    { id: 'B', text: 'Requires future knowledge of page references', isCorrect: true },
                    { id: 'C', text: 'Uses too much memory', isCorrect: false },
                    { id: 'D', text: 'Only works on small systems', isCorrect: false }
                ],
                explanation: 'Optimal algorithm requires knowing future page references, which is impossible in practice.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the working set of a process?',
                options: [
                    { id: 'A', text: 'All pages of the process', isCorrect: false },
                    { id: 'B', text: 'Set of pages actively used in recent time window', isCorrect: true },
                    { id: 'C', text: 'Code segment only', isCorrect: false },
                    { id: 'D', text: 'Stack pages only', isCorrect: false }
                ],
                explanation: 'Working set is the set of pages that a process has referenced in the recent time window.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is compaction?',
                options: [
                    { id: 'A', text: 'Compressing files', isCorrect: false },
                    { id: 'B', text: 'Moving processes to create contiguous free space', isCorrect: true },
                    { id: 'C', text: 'Deleting processes', isCorrect: false },
                    { id: 'D', text: 'Reducing page size', isCorrect: false }
                ],
                explanation: 'Compaction moves allocated blocks together to create larger contiguous free space.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is segmentation?',
                options: [
                    { id: 'A', text: 'Dividing memory into equal-sized pages', isCorrect: false },
                    { id: 'B', text: 'Dividing process into logical segments of variable size', isCorrect: true },
                    { id: 'C', text: 'Dividing disk into sectors', isCorrect: false },
                    { id: 'D', text: 'Sorting memory blocks', isCorrect: false }
                ],
                explanation: 'Segmentation divides process into logical segments (code, data, stack) of variable sizes.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the LRU page replacement algorithm?',
                options: [
                    { id: 'A', text: 'Replace first loaded page', isCorrect: false },
                    { id: 'B', text: 'Replace least recently used page', isCorrect: true },
                    { id: 'C', text: 'Replace most recently used page', isCorrect: false },
                    { id: 'D', text: 'Replace random page', isCorrect: false }
                ],
                explanation: 'LRU replaces the page that has not been used for the longest time, approximating optimal.',
                difficulty: 'easy'
            }
        ]
    },

    // ===== SYNCHRONIZATION - HARD =====
    {
        id: 'os-synchronization',
        title: 'Process Synchronization',
        description: 'Synchronization primitives and concurrency',
        category: 'operating-systems',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is a race condition?',
                options: [
                    { id: 'A', text: 'Processes competing for speed', isCorrect: false },
                    { id: 'B', text: 'Outcome depends on timing of process execution', isCorrect: true },
                    { id: 'C', text: 'A type of deadlock', isCorrect: false },
                    { id: 'D', text: 'Memory overflow', isCorrect: false }
                ],
                explanation: 'Race condition occurs when multiple processes access shared data and outcome depends on execution timing.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is mutual exclusion?',
                options: [
                    { id: 'A', text: 'Processes running simultaneously', isCorrect: false },
                    { id: 'B', text: 'Only one process can access critical section at a time', isCorrect: true },
                    { id: 'C', text: 'Processes sharing memory', isCorrect: false },
                    { id: 'D', text: 'Processes communicating', isCorrect: false }
                ],
                explanation: 'Mutual exclusion ensures only one process can execute in its critical section at any time.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a binary semaphore?',
                options: [
                    { id: 'A', text: 'Semaphore with values 0 to n', isCorrect: false },
                    { id: 'B', text: 'Semaphore with values 0 and 1 only', isCorrect: true },
                    { id: 'C', text: 'A type of mutex', isCorrect: false },
                    { id: 'D', text: 'A counting mechanism', isCorrect: false }
                ],
                explanation: 'Binary semaphore can only have values 0 (locked) and 1 (unlocked), similar to a mutex.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between semaphore and mutex?',
                options: [
                    { id: 'A', text: 'They are identical', isCorrect: false },
                    { id: 'B', text: 'Mutex has ownership, semaphore does not', isCorrect: true },
                    { id: 'C', text: 'Semaphore is faster', isCorrect: false },
                    { id: 'D', text: 'Mutex can count, semaphore cannot', isCorrect: false }
                ],
                explanation: 'Mutex must be released by the same thread that acquired it; semaphore can be signaled by any thread.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the Producer-Consumer problem?',
                options: [
                    { id: 'A', text: 'Economic supply-demand issue', isCorrect: false },
                    { id: 'B', text: 'Synchronizing producers adding to buffer and consumers removing', isCorrect: true },
                    { id: 'C', text: 'Memory allocation problem', isCorrect: false },
                    { id: 'D', text: 'CPU scheduling issue', isCorrect: false }
                ],
                explanation: 'Producer-Consumer: synchronize producers adding items to bounded buffer and consumers removing items.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Readers-Writers problem?',
                options: [
                    { id: 'A', text: 'File read/write permissions', isCorrect: false },
                    { id: 'B', text: 'Allowing multiple readers OR single writer at a time', isCorrect: true },
                    { id: 'C', text: 'Database backup issue', isCorrect: false },
                    { id: 'D', text: 'Memory access problem', isCorrect: false }
                ],
                explanation: 'Readers-Writers: allow multiple concurrent readers, but exclusive access for writers.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Dining Philosophers problem?',
                options: [
                    { id: 'A', text: 'Restaurant management', isCorrect: false },
                    { id: 'B', text: 'Classic synchronization problem with shared resources', isCorrect: true },
                    { id: 'C', text: 'Food distribution algorithm', isCorrect: false },
                    { id: 'D', text: 'Table allocation problem', isCorrect: false }
                ],
                explanation: 'Dining Philosophers illustrates deadlock and resource allocation with philosophers sharing forks.',
                difficulty: 'medium'
            },
            {
                questionText: 'What are the Peterson\'s Solution conditions?',
                options: [
                    { id: 'A', text: 'Only for multiprocessor systems', isCorrect: false },
                    { id: 'B', text: 'Mutual exclusion, progress, and bounded waiting', isCorrect: true },
                    { id: 'C', text: 'FIFO ordering only', isCorrect: false },
                    { id: 'D', text: 'No waiting required', isCorrect: false }
                ],
                explanation: 'Peterson\'s solution satisfies mutual exclusion, progress, and bounded waiting for 2 processes.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a monitor in OS?',
                options: [
                    { id: 'A', text: 'Display screen', isCorrect: false },
                    { id: 'B', text: 'High-level synchronization construct', isCorrect: true },
                    { id: 'C', text: 'System monitoring tool', isCorrect: false },
                    { id: 'D', text: 'Debug utility', isCorrect: false }
                ],
                explanation: 'Monitor is a high-level synchronization construct that encapsulates shared data and operations.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is spinlock?',
                options: [
                    { id: 'A', text: 'A lock that spins forever', isCorrect: false },
                    { id: 'B', text: 'Lock where thread busy-waits until available', isCorrect: true },
                    { id: 'C', text: 'A rotating disk lock', isCorrect: false },
                    { id: 'D', text: 'A type of deadlock', isCorrect: false }
                ],
                explanation: 'Spinlock: thread continuously checks (spins) until lock becomes available, useful for short waits.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is priority inversion?',
                options: [
                    { id: 'A', text: 'High priority process runs first', isCorrect: false },
                    { id: 'B', text: 'Low priority process blocks high priority process', isCorrect: true },
                    { id: 'C', text: 'Priorities are reversed automatically', isCorrect: false },
                    { id: 'D', text: 'Equal priority for all', isCorrect: false }
                ],
                explanation: 'Priority inversion: high priority process waits for low priority process holding a resource.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the test-and-set instruction?',
                options: [
                    { id: 'A', text: 'Testing memory', isCorrect: false },
                    { id: 'B', text: 'Atomic instruction to read and set a value', isCorrect: true },
                    { id: 'C', text: 'Setting test mode', isCorrect: false },
                    { id: 'D', text: 'Debugging command', isCorrect: false }
                ],
                explanation: 'Test-and-set is an atomic hardware instruction used to implement locks.',
                difficulty: 'hard'
            }
        ]
    }
];

const seedOSQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find admin user
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('⚠️  No admin found, creating one...');
            admin = await User.create({
                username: 'admin',
                email: 'admin@brainspark.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        // Delete existing OS quizzes
        await Quiz.deleteMany({ category: 'operating-systems' });
        console.log('🗑️  Cleared existing OS quizzes');

        // Insert quizzes
        const quizzesWithCreator = osQuizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        const totalQuestions = osQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        console.log(`✅ Seeded ${osQuizzes.length} OS quizzes with ${totalQuestions} total questions!`);
        console.log('\n📊 OS Quiz Summary:');
        osQuizzes.forEach(quiz => {
            console.log(`   - ${quiz.title}: ${quiz.questions.length} questions (${quiz.difficulty})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding OS quizzes:', error);
        process.exit(1);
    }
};

seedOSQuizzes();
