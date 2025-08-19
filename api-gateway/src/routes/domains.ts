import { Router } from 'express';
import { authenticateToken, validateRequest } from '../middleware/validation';
import { DNSVerificationService } from '../services/dns';

const router = Router();
const dnsService = new DNSVerificationService();

// Mock domain storage
const domains: any[] = [];
let domainIdCounter = 1;

// Verify domain
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Domain is required'
      });
    }

    // Check if domain is already verified by this user
    const existingDomain = domains.find(d => d.domain === domain && d.userId === userId);
    if (existingDomain) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Domain already exists for this user'
      });
    }

    // Verify domain
    const verification = await dnsService.verifyDomain(domain);

    // Create domain record
    const domainRecord = {
      id: domainIdCounter.toString(),
      userId,
      domain,
      status: verification.status,
      verifiedAt: verification.status === 'verified' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      verification
    };

    domains.push(domainRecord);
    domainIdCounter++;

    res.json({
      success: true,
      message: 'Domain verification completed',
      domain: domainRecord
    });

  } catch (error) {
    console.error('Domain verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Domain verification failed'
    });
  }
});

// Get user domains
router.get('/', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const userDomains = domains.filter(d => d.userId === userId);
  
  res.json({
    success: true,
    domains: userDomains
  });
});

// Get specific domain
router.get('/:id', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const domainId = req.params.id;
  
  const domain = domains.find(d => d.id === domainId && d.userId === userId);
  
  if (!domain) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Domain not found'
    });
  }
  
  res.json({
    success: true,
    domain
  });
});

// Re-verify domain
router.post('/:id/reverify', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const domainId = req.params.id;
    
    const domainIndex = domains.findIndex(d => d.id === domainId && d.userId === userId);
    
    if (domainIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Domain not found'
      });
    }
    
    const domain = domains[domainIndex];
    
    // Re-verify domain
    const verification = await dnsService.verifyDomain(domain.domain);
    
    // Update domain record
    domains[domainIndex] = {
      ...domain,
      status: verification.status,
      verifiedAt: verification.status === 'verified' ? new Date().toISOString() : domain.verifiedAt,
      lastChecked: new Date().toISOString(),
      verification
    };
    
    res.json({
      success: true,
      message: 'Domain re-verification completed',
      domain: domains[domainIndex]
    });
    
  } catch (error) {
    console.error('Domain re-verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Domain re-verification failed'
    });
  }
});

// Generate DNS configuration
router.post('/:id/dns-config', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const domainId = req.params.id;
    
    const domain = domains.find(d => d.id === domainId && d.userId === userId);
    
    if (!domain) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Domain not found'
      });
    }
    
    const config = await dnsService.generateDNSConfig(domain.domain);
    
    res.json({
      success: true,
      message: 'DNS configuration generated',
      config
    });
    
  } catch (error) {
    console.error('DNS config generation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'DNS configuration generation failed'
    });
  }
});

// Generate DKIM keys
router.post('/:id/dkim', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const domainId = req.params.id;
    
    const domain = domains.find(d => d.id === domainId && d.userId === userId);
    
    if (!domain) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Domain not found'
      });
    }
    
    const dkimKeys = dnsService.generateDKIMKey(domain.domain);
    
    res.json({
      success: true,
      message: 'DKIM keys generated',
      dkim: dkimKeys
    });
    
  } catch (error) {
    console.error('DKIM key generation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'DKIM key generation failed'
    });
  }
});

// Check DNS propagation
router.get('/:id/propagation', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const domainId = req.params.id;
    
    const domain = domains.find(d => d.id === domainId && d.userId === userId);
    
    if (!domain) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Domain not found'
      });
    }
    
    const propagation = await dnsService.checkPropagation(domain.domain);
    
    res.json({
      success: true,
      message: 'Propagation check completed',
      propagation
    });
    
  } catch (error) {
    console.error('Propagation check error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Propagation check failed'
    });
  }
});

// Delete domain
router.delete('/:id', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const domainId = req.params.id;
  
  const domainIndex = domains.findIndex(d => d.id === domainId && d.userId === userId);
  
  if (domainIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Domain not found'
    });
  }
  
  domains.splice(domainIndex, 1);
  
  res.json({
    success: true,
    message: 'Domain deleted successfully'
  });
});

// Set domain as primary
router.post('/:id/primary', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const domainId = req.params.id;
  
  const domain = domains.find(d => d.id === domainId && d.userId === userId);
  
  if (!domain) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Domain not found'
    });
  }
  
  // Remove primary status from other domains
  domains.forEach(d => {
    if (d.userId === userId) {
      d.isPrimary = false;
    }
  });
  
  // Set this domain as primary
  domain.isPrimary = true;
  
  res.json({
    success: true,
    message: 'Domain set as primary',
    domain
  });
});

// Get domain statistics
router.get('/:id/stats', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const domainId = req.params.id;
  
  const domain = domains.find(d => d.id === domainId && d.userId === userId);
  
  if (!domain) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Domain not found'
    });
  }
  
  // Mock statistics
  const stats = {
    emailAccounts: 5,
    mailboxes: 12,
    storageUsed: '2.3 GB',
    storageTotal: '15 GB',
    aliases: 3,
    forwards: 2,
    lastSync: new Date().toISOString(),
    health: 'healthy'
  };
  
  res.json({
    success: true,
    stats
  });
});

export default router;