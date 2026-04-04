// apiUrl host is replaced at deploy time from GitHub Actions secret EC2_HOST (Terraform output)
export const environment = {
  production: true,
  apiUrl: 'https://__EC2_HOST__:4444/api/',
};
