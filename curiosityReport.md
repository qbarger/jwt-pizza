# Serverless Deployment

### What is the purpose?
  Serverless deployment is a somewhat new method of deploying and maintaining an application using cloud offerings. For example, a company may use a third-party provider, such as Amazon Web Services or Azure, to host their application and manage deployments and updates. The third-party cloud provider will take care of all the server management and infrastructure, which frees up the developer to focus on its application code. 
  The name 'serverless deployment' is a little misleading. It does not mean that the application is hosted without servers. What it means is that the developer of the application does not have to maintain servers. All the server infrastructure is maintained by the cloud provider. All the developer has to do is deploy its code to a cloud provider, and the provider takes care of the rest. Now the process of deployment is a bit more nuanced, but that's the basic idea.


---

### How does it work?
  Serverless deployment works by way of events and triggers. When a specified event occurs (such as a 'git push') the cloud providings will execute any and all actions/functions that have been configured. The actions or functions that are executed are specified by the developer. When an event trigger occurs, the cloud platform will spin up a container to process and execute the corresponding function(s). When the action has been completed the container can be discarded. This allows for a very efficient use of time and resources during application deployment. And guess what! The cloud provider will also allow for automatic scaling! Isn't that amazing? If more actions are needed or the rate of function calls increases, the serverless provider will just spin up more containers to execute the tasks. It really is an incredible tool for the developer. However, it is not without problems or risks. What if your application fails after being deployed to production? What if you need to process and use sensitive information during deployment? Who gets access to the different stages of deployment? There are many risks that can come with serverless deployment, but there are also many ways to deal with those risks. Let's dive in to the different types of serverless deployment and how we can mitigate risks.

---

### Types of Serverless Deployment
1. **Direct Deployment**
- This is the simplest type of deployment (also known as All-at-once deployment) where the application is deployed to all instances at the same time. This means that when the developer deploys their application, everyone will get it at the same time. It's really simple, but it introduces some risks. What if you deploy to all instances and there is a bug in the application? This is a major risk for this type of deployment. However, you can automate the application version to be rolled back to the previous one if any bugs or failures occur.
2. **Blue-Green Deployment**
- This type of deployment takes into account the risks of direct deployment and attempts to mitigate them. With blue-green deployment the developer maintains two environments: blue and green. Only one of these environments is available for production use at a time. If the blue environment is in production, then the new application code is tested thoroughly in the green environment. Once the new application code is tested and ready, it is deployed to production in the green environment. The developer will change all production routes to the green environment, and the blue environment will become the new testing one. This method of switching testing and production continues for each new version release. If there is an issue with the new release all traffic can be routed back to the other environment.
3. **Canary Deployment**
- Canary deployment is almost a mix of the above two types of deployment. It involves releasing the new application version gradually to the users. With canary deployment the developer determines subsets of users, and routes those users to the new version gradually before releasing the new version to everyone. This way the developer can limit any possible bugs to a small group of users. If there are any bugs or failures that occur, all the users can easily be directed back to the previous version of the application.

There are several other types of serverless deployment that employ similar methods, but these three are the most common types. All of these different types of deployment are supported by and made simple to implement by serverless cloud providers!
