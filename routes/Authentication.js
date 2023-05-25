// The standard authentication
export function isAuthenticated(req, res, next) {
  // Their session data is checked
    if (req.session.isAuthenticated) {
      next();
    } else {
      // send error message
      res.status(401).send("Acces not granted");
    }
  }
  
  export function IsAdmin(req, res, next) {
    // Their session data is checked
    if (req.session.UserLevel.isAdmin) {
      next();
    } else {
      // send error message
      res.status(401).send("Acces not granted");
    }
  }
  
  export function IsManager(req, res, next) {
    // Their session data is checked
    if (req.session.UserLevel.isManager) {
      next();
    } else {
      // send error message
      res.status(401).send("Acces not granted");
    }
  }

 export function IsProjectManager(req, res, next) {
    // Their session data is checked
    if (req.session.UserLevel.isProjectManager) {
      next();
    } else {
      // send error message
      res.status(401).send("Acces not granted");
    }
  }