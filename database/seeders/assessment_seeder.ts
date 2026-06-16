import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { cuid } from '#utils/id'
import Post from '#models/post'

const now = () => DateTime.now().toJSDate()

// 5 questions per lesson × 8 lessons = 40 questions total
const questionsByTitle: Record<string, { question: string; options: string[]; correct: number }[]> =
  {
    'Introduction to Hotel Management': [
      {
        question: 'What is the primary goal of hotel management?',
        options: [
          'Maximize room revenue',
          'Ensure guest satisfaction and operational efficiency',
          'Minimize staff costs',
          'Expand hotel chains',
        ],
        correct: 1,
      },
      {
        question: 'Which department is responsible for welcoming guests?',
        options: ['Housekeeping', 'Food & Beverage', 'Front Office', 'Sales'],
        correct: 2,
      },
      {
        question: 'What type of hotel offers limited services at lower prices?',
        options: ['Luxury hotel', 'Resort', 'Budget hotel', 'Boutique hotel'],
        correct: 2,
      },
      {
        question: 'What does RMS stand for in hotel management?',
        options: [
          'Revenue Management System',
          'Room Maintenance Schedule',
          'Regional Manager Strategy',
          'Reservation Management Software',
        ],
        correct: 0,
      },
      {
        question: 'Which is NOT a typical hotel department?',
        options: ['Front Office', 'Housekeeping', 'Transportation', 'Engineering'],
        correct: 2,
      },
    ],
    'Front Desk Operations': [
      {
        question: 'What is the first step in the check-in process?',
        options: [
          'Payment collection',
          'Room assignment',
          'Greeting the guest',
          'Key card preparation',
        ],
        correct: 2,
      },
      {
        question: 'What does a PMS system help with?',
        options: [
          'Staff scheduling',
          'Managing reservations and guest data',
          'Inventory management',
          'Social media marketing',
        ],
        correct: 1,
      },
      {
        question: 'What is a "walk-in" guest?',
        options: [
          'A guest who walks to the hotel',
          'A guest without a prior reservation',
          'A VIP guest',
          'A guest checking out',
        ],
        correct: 1,
      },
      {
        question: 'Early check-in refers to:?',
        options: [
          'Checking in before 6 AM',
          'Arriving before the standard check-in time',
          'Checking in online',
          'Late night arrival',
        ],
        correct: 1,
      },
      {
        question: 'What is a "no-show"?',
        options: [
          'A cancelled reservation',
          'A guest who arrives late',
          'A reservation where the guest does not arrive',
          'A group booking',
        ],
        correct: 2,
      },
    ],
    'Housekeeping Standards': [
      {
        question: 'What is the first step in cleaning a guest room?',
        options: [
          'Vacuuming',
          'Making the bed',
          'Removing used linens and trash',
          'Cleaning the bathroom',
        ],
        correct: 2,
      },
      {
        question: 'What does "turndown service" mean?',
        options: [
          'Turning down the bed for sleeping',
          'Cleaning the room twice a day',
          'Changing all linens',
          'Evening preparation of the guest room',
        ],
        correct: 3,
      },
      {
        question: 'What is the most important quality for a housekeeper?',
        options: ['Speed', 'Attention to detail', 'Physical strength', 'Creativity'],
        correct: 1,
      },
      {
        question: 'How often should public areas be inspected?',
        options: ['Once a day', 'Multiple times a day', 'Once a week', 'Only during VIP visits'],
        correct: 1,
      },
      {
        question: 'What does "DND" mean on a room status?',
        options: ['Do Not Disturb', 'Delayed Night Duty', 'Done and Dusted', 'Do Not Delay'],
        correct: 0,
      },
    ],
    'Guest Relations & Communication': [
      {
        question: 'What is the most important skill in guest relations?',
        options: ['Multi-tasking', 'Active listening', 'Speed', 'Technical knowledge'],
        correct: 1,
      },
      {
        question: 'When handling a complaint, what should you do first?',
        options: [
          'Offer a discount',
          'Apologize and listen',
          'Explain why it happened',
          'Call the manager',
        ],
        correct: 1,
      },
      {
        question: 'What does "going the extra mile" mean in hospitality?',
        options: [
          'Working overtime',
          'Exceeding guest expectations',
          'Walking longer distances',
          'Doing extra paperwork',
        ],
        correct: 1,
      },
      {
        question: 'What is the best way to build rapport with a guest?',
        options: [
          'Talking about yourself',
          'Using the guests name',
          'Asking for tips',
          'Giving discounts',
        ],
        correct: 1,
      },
      {
        question: 'Upselling in hospitality means what?',
        options: [
          'Selling more rooms',
          'Offering premium services to guests',
          'Increasing prices',
          'Training staff',
        ],
        correct: 1,
      },
    ],
    'Basic Greetings and Introductions': [
      {
        question: 'What is the most appropriate greeting for a guest arriving at 2 PM?',
        options: ['Good morning', 'Good afternoon', 'Good evening', 'Hello'],
        correct: 1,
      },
      {
        question: 'How should you introduce yourself to a guest?',
        options: [
          'I am the manager here',
          'My name is name how may I help you',
          'What do you want',
          'You can call me sir',
        ],
        correct: 1,
      },
      {
        question: 'What is a formal way to address a male guest?',
        options: ['Brother', 'Sir', 'Mister Smith', 'Hey'],
        correct: 1,
      },
      {
        question: 'Which phrase is most welcoming?',
        options: [
          'What now',
          'Welcome to our hotel. How may I assist you',
          'Tell me what you need',
          'Next please',
        ],
        correct: 1,
      },
      {
        question: 'When saying goodbye to a guest you should do what?',
        options: [
          'Just wave',
          'Thank them and wish them a great day',
          'Ignore them',
          'Tell them to come back',
        ],
        correct: 1,
      },
    ],
    'Handling Guest Queries': [
      {
        question: 'If a guest asks about local attractions what should you do?',
        options: [
          'Say you dont know',
          'Provide accurate information or find out',
          'Tell them to search online',
          'Ignore the question',
        ],
        correct: 1,
      },
      {
        question: 'What is the best response if you dont know an answer?',
        options: [
          'I dont know',
          'Let me check with the department and get back to you',
          'Ask someone else',
          'Say nothing',
        ],
        correct: 1,
      },
      {
        question: 'How should you respond to a guest asking for directions?',
        options: [
          'Point vaguely',
          'Give clear directions and offer a map',
          'Say you are busy',
          'Tell them to use GPS',
        ],
        correct: 1,
      },
      {
        question: 'What should you do if a guest asks about room rates?',
        options: [
          'Refuse to answer',
          'Politely explain rates and packages',
          'Give the lowest rate',
          'Tell them to check online',
        ],
        correct: 1,
      },
      {
        question: 'When a guest asks about hotel facilities your response should be?',
        options: [
          'Brief and dismissive',
          'Informative and enthusiastic',
          'Vague',
          'Redirect to another staff',
        ],
        correct: 1,
      },
    ],
    'Telephone Etiquette': [
      {
        question: 'How many rings should you let the phone ring before answering?',
        options: ['1 ring', '2 to 3 rings', '5 to 6 rings', 'As many as needed'],
        correct: 1,
      },
      {
        question: 'What is the correct way to answer a business phone?',
        options: ['Hello', 'Good morning Hotel Name How may I help you', 'Yes', 'Who is this'],
        correct: 1,
      },
      {
        question: 'When taking a message what information is essential?',
        options: [
          'Only the name',
          'Caller name phone number time and message',
          'The caller mood',
          'Your opinion',
        ],
        correct: 1,
      },
      {
        question: 'If you need to put a caller on hold what should you do?',
        options: [
          'Just put them on hold',
          'Ask permission and wait for response',
          'Tell them to wait',
          'Hang up quickly',
        ],
        correct: 1,
      },
      {
        question: 'What tone should you use when speaking on the phone?',
        options: ['Monotone', 'Professional clear and friendly', 'Loud and fast', 'Whispering'],
        correct: 1,
      },
    ],
    'Handling Complaints Professionally': [
      {
        question: 'What is the first step in handling a complaint?',
        options: [
          'Defend the hotel',
          'Listen without interrupting',
          'Offer compensation',
          'Call security',
        ],
        correct: 1,
      },
      {
        question: 'The acronym LEARN for complaint handling stands for what?',
        options: [
          'Listen Empathize Apologize Respond Notify',
          'Leave Enter Act React Note',
          'Learn Engage Answer Review Notice',
          'None of the above',
        ],
        correct: 0,
      },
      {
        question: 'What should you avoid when handling complaints?',
        options: ['Apologizing', 'Blaming other departments', 'Taking notes', 'Following up'],
        correct: 1,
      },
      {
        question: 'After resolving a complaint what should you do?',
        options: [
          'Consider it done',
          'Follow up with the guest',
          'Ignore it',
          'Tell your manager only',
        ],
        correct: 1,
      },
      {
        question: 'What is the best way to apologize to a guest?',
        options: [
          'I am sorry you feel that way',
          'Please accept my sincere apologies',
          'It is not my fault',
          'These things happen',
        ],
        correct: 1,
      },
    ],
  }

export default class AssessmentSeeder extends BaseSeeder {
  async run() {
    const posts = await Post.query().whereIn('postType', ['Lesson']).where('state', 'Public')

    for (const post of posts) {
      const questions = questionsByTitle[post.title]
      if (!questions) {
        console.log(`No questions for: ${post.title}`)
        continue
      }

      // Check if assessment already exists
      const existing = await db.from('assessments').where('post_id', post.id).first()
      if (existing) continue

      const assessmentId = cuid()
      await db
        .table('assessments')
        .insert({ id: assessmentId, post_id: post.id, created_at: now(), updated_at: now() })

      const labels = ['A', 'B', 'C', 'D']
      const questionRows = questions.map((q, i) => ({
        id: cuid(),
        assessment_id: assessmentId,
        question: q.question,
        option_a: q.options[0],
        option_b: q.options[1],
        option_c: q.options[2] || '',
        option_d: q.options[3] || '',
        correct_answer: labels[q.correct],
        sort_order: i,
        created_at: now(),
        updated_at: now(),
      }))
      await db.table('assessment_questions').insert(questionRows)
      console.log(`  ✓ Added ${questions.length} questions for: ${post.title}`)
    }
  }
}
