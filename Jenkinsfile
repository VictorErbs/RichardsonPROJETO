pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
  }

  environment {
    NODE_ENV = 'production'
    # Increase memory for TypeScript/Vite if needed
    NODE_OPTIONS = '--max_old_space_size=4096'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          echo "Branch: ${env.BRANCH_NAME ?: 'main'}"
        }
      }
    }

    stage('Verify Node') {
      steps {
        script {
          try {
            sh 'node -v && npm -v'
          } catch (e) {
            echo 'Node.js is required on the Jenkins agent. Please install Node >= 18 or configure the NodeJS plugin.'
            error 'Node not available on agent'
          }
        }
      }
    }

    stage('Backend: Install & Build') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm run prisma:generate'
          sh 'npm run build'
        }
      }
    }

    stage('Frontend: Install, Lint & Build') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run lint || echo "Lint warnings (non-blocking)"'
          sh 'npm run build'
        }
      }
    }

    stage('Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: 'frontend/dist/**, backend/dist/**', fingerprint: true, allowEmptyArchive: true
      }
    }
  }

  post {
    success {
      echo '✅ Build finished successfully.'
    }
    failure {
      echo '❌ Build failed.'
    }
    always {
      script {
        echo "Node: ${sh(returnStdout: true, script: 'node -v').trim()}"
        echo "NPM: ${sh(returnStdout: true, script: 'npm -v').trim()}"
      }
    }
  }
}
