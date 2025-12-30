pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: playwright
      image: mcr.microsoft.com/playwright:v1.48.0-jammy
      command: ["cat"]
      tty: true
      resources:
        requests:
          cpu: "500m"
          memory: "1Gi"
        limits:
          cpu: "2"
          memory: "4Gi"
      securityContext:
        allowPrivilegeEscalation: false
"""
            defaultContainer 'playwright'
        }
    }

    stages {
        stage("Checkout Repo") {
            steps {
                checkout scm
            }
        }

        stage("Install Dependencies") {
            steps {
                sh "node -v"
                sh "npm install"           // install dependencies
                sh "npx playwright install" // install browsers
            }
        }

        stage("Run Playwright Tests") {
            steps {
                sh "npx playwright test --reporter=line"
            }
        }

        stage("Archive Test Report") {
            steps {
                // jika kamu pakai HTML report
                sh "npx playwright show-report || true"
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }
}
