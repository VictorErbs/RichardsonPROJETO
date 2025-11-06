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
    // Increase memory for TypeScript/Vite if needed
    NODE_OPTIONS = '--max_old_space_size=4096'
  }

  parameters {
    booleanParam(name: 'DOCKER_BUILD', defaultValue: false, description: 'Build and (optionally) push Docker images')
    string(name: 'DOCKER_REGISTRY', defaultValue: '', description: 'Docker registry (e.g., ghcr.io/owner or registry.hub.docker.com) - leave empty to build locally only')
    string(name: 'DOCKER_BACKEND_IMAGE', defaultValue: 'phishing-backend', description: 'Backend image name (without registry)')
    string(name: 'DOCKER_FRONTEND_IMAGE', defaultValue: 'phishing-frontend', description: 'Frontend image name (without registry)')
    string(name: 'DOCKER_TAG', defaultValue: 'latest', description: 'Image tag')
    string(name: 'DOCKER_CREDENTIALS_ID', defaultValue: '', description: 'Jenkins credentialsId for Docker registry (username/password). Leave empty to skip push')
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

    stage('Docker (optional)') {
      when {
        expression { return params.DOCKER_BUILD }
      }
      steps {
        script {
          def backendDockerfile = 'backend/Dockerfile'
          def frontendDockerfile = 'frontend/Dockerfile'

          def registryPrefix = (params.DOCKER_REGISTRY?.trim()) ? "${params.DOCKER_REGISTRY.trim()}/" : ''
          def backendImage = "${registryPrefix}${params.DOCKER_BACKEND_IMAGE}:${params.DOCKER_TAG}"
          def frontendImage = "${registryPrefix}${params.DOCKER_FRONTEND_IMAGE}:${params.DOCKER_TAG}"

          if (fileExists(backendDockerfile)) {
            echo "Building backend image: ${backendImage}"
            sh "docker build -t ${backendImage} -f ${backendDockerfile} backend"
          } else {
            echo 'No backend/Dockerfile found. Skipping backend image.'
          }

          if (fileExists(frontendDockerfile)) {
            echo "Building frontend image: ${frontendImage}"
            sh "docker build -t ${frontendImage} -f ${frontendDockerfile} frontend"
          } else {
            echo 'No frontend/Dockerfile found. Skipping frontend image.'
          }

          if (params.DOCKER_REGISTRY?.trim() && params.DOCKER_CREDENTIALS_ID?.trim()) {
            echo "Pushing images to registry: ${params.DOCKER_REGISTRY}"
            withCredentials([usernamePassword(credentialsId: params.DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
              sh label: 'Docker login', script: """
                echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin ${params.DOCKER_REGISTRY}
              """
              if (fileExists(backendDockerfile)) {
                sh "docker push ${backendImage}"
              }
              if (fileExists(frontendDockerfile)) {
                sh "docker push ${frontendImage}"
              }
              sh "docker logout ${params.DOCKER_REGISTRY} || true"
            }
          } else {
            echo 'Registry or credentials not provided. Skipping docker push.'
          }
        }
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
