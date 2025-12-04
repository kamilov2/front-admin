import { NextRequest, NextResponse } from 'next/server';

interface Test {
  id: number;
  name: string;
  category: string;
  questions: number;
  status: "published" | "draft";
  language: string;
  description?: string;
  surveyJson?: any;
}

// In-memory storage (replace with database in production)
let tests: Test[] = [
  {
    id: 1,
    name: "ЕНТ Математика 2025",
    category: "Математика",
    questions: 25,
    status: "published",
    language: "RU/KZ",
    description: "Полный тест по математике для подготовки к ЕНТ 2025",
    surveyJson: {
      title: "ЕНТ Математика 2025",
      description: "Полный тест по математике для подготовки к ЕНТ 2025",
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "radiogroup",
              name: "question1",
              title: "Чему равно 2 + 2?",
              choices: ["3", "4", "5", "6"],
              correctAnswer: "4"
            }
          ]
        }
      ]
    }
  },
];

// GET - Get all tests
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ tests, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tests', success: false },
      { status: 500 }
    );
  }
}

// POST - Create new test
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newTest: Test = {
      id: tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1,
      name: data.name,
      category: data.category,
      questions: data.questions,
      status: data.status,
      language: data.language,
      description: data.description,
      surveyJson: data.surveyJson,
    };

    tests.push(newTest);

    return NextResponse.json({
      test: newTest,
      success: true,
      message: 'Test created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create test', success: false },
      { status: 500 }
    );
  }
}

// PUT - Update test
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const testIndex = tests.findIndex(t => t.id === data.id);

    if (testIndex === -1) {
      return NextResponse.json(
        { error: 'Test not found', success: false },
        { status: 404 }
      );
    }

    tests[testIndex] = {
      ...tests[testIndex],
      name: data.name,
      category: data.category,
      questions: data.questions,
      status: data.status,
      language: data.language,
      description: data.description,
      surveyJson: data.surveyJson,
    };

    return NextResponse.json({
      test: tests[testIndex],
      success: true,
      message: 'Test updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update test', success: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete test
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json(
        { error: 'Test ID is required', success: false },
        { status: 400 }
      );
    }

    const testIndex = tests.findIndex(t => t.id === id);

    if (testIndex === -1) {
      return NextResponse.json(
        { error: 'Test not found', success: false },
        { status: 404 }
      );
    }

    tests.splice(testIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete test', success: false },
      { status: 500 }
    );
  }
}
