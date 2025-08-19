import { exec } from 'child_process';
import { promisify } from 'util';
import dns from 'dns';

const execAsync = promisify(exec);

export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
  priority?: number;
}

export interface DomainVerificationResult {
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  records: {
    mx: DNSRecord[];
    txt: DNSRecord[];
    a: DNSRecord[];
    aaaa: DNSRecord[];
  };
  required: {
    mx: boolean;
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
  };
  errors: string[];
  recommendations: string[];
}

export class DNSVerificationService {
  private async resolveDNS(domain: string, type: string): Promise<DNSRecord[]> {
    return new Promise((resolve, reject) => {
      dns.resolve(domain, type, (err, records) => {
        if (err) {
          if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          const formattedRecords: DNSRecord[] = [];
          
          switch (type) {
            case 'MX':
              records.forEach((record: any) => {
                formattedRecords.push({
                  type: 'MX',
                  name: domain,
                  value: record.exchange,
                  priority: record.priority,
                  ttl: record.ttl
                });
              });
              break;
            case 'TXT':
              records.forEach((record: any) => {
                formattedRecords.push({
                  type: 'TXT',
                  name: domain,
                  value: record.join(''),
                  ttl: record.ttl
                });
              });
              break;
            case 'A':
              records.forEach((record: any) => {
                formattedRecords.push({
                  type: 'A',
                  name: domain,
                  value: record,
                  ttl: record.ttl
                });
              });
              break;
            case 'AAAA':
              records.forEach((record: any) => {
                formattedRecords.push({
                  type: 'AAAA',
                  name: domain,
                  value: record,
                  ttl: record.ttl
                });
              });
              break;
          }
          
          resolve(formattedRecords);
        }
      });
    });
  }

  async verifyDomain(domain: string): Promise<DomainVerificationResult> {
    const result: DomainVerificationResult = {
      domain,
      status: 'pending',
      records: {
        mx: [],
        txt: [],
        a: [],
        aaaa: []
      },
      required: {
        mx: false,
        spf: false,
        dkim: false,
        dmarc: false
      },
      errors: [],
      recommendations: []
    };

    try {
      // Resolve all DNS records
      result.records.mx = await this.resolveDNS(domain, 'MX');
      result.records.txt = await this.resolveDNS(domain, 'TXT');
      result.records.a = await this.resolveDNS(domain, 'A');
      result.records.aaaa = await this.resolveDNS(domain, 'AAAA');

      // Check MX records
      if (result.records.mx.length > 0) {
        result.required.mx = true;
        result.recommendations.push('✅ MX records found');
      } else {
        result.errors.push('No MX records found');
        result.recommendations.push('Add MX record: mail.oxlas.com');
      }

      // Check SPF record
      const spfRecord = result.records.txt.find(record => 
        record.value.startsWith('v=spf1')
      );
      if (spfRecord) {
        result.required.spf = true;
        result.recommendations.push('✅ SPF record found');
      } else {
        result.errors.push('No SPF record found');
        result.recommendations.push('Add TXT record: v=spf1 include:_spf.oxlas.com ~all');
      }

      // Check DKIM record
      const dkimRecord = result.records.txt.find(record => 
        record.value.startsWith('v=DKIM1')
      );
      if (dkimRecord) {
        result.required.dkim = true;
        result.recommendations.push('✅ DKIM record found');
      } else {
        result.errors.push('No DKIM record found');
        result.recommendations.push('Add TXT record for default._domainkey: v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...');
      }

      // Check DMARC record
      const dmarcRecord = result.records.txt.find(record => 
        record.name === '_dmarc.' + domain && record.value.startsWith('v=DMARC1')
      );
      if (dmarcRecord) {
        result.required.dmarc = true;
        result.recommendations.push('✅ DMARC record found');
      } else {
        result.errors.push('No DMARC record found');
        result.recommendations.push('Add TXT record: v=DMARC1; p=quarantine; rua=mailto:dmarc@oxlas.com');
      }

      // Determine overall status
      if (result.required.mx && result.required.spf && result.required.dkim && result.required.dmarc) {
        result.status = 'verified';
      } else if (result.errors.length > 0) {
        result.status = 'failed';
      }

    } catch (error) {
      result.errors.push(`DNS resolution failed: ${error}`);
      result.status = 'failed';
    }

    return result;
  }

  generateDKIMKey(domain: string): { privateKey: string; publicKey: string; record: string } {
    // This is a simplified version - in production, use openssl or crypto library
    const mockPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...';
    const mockPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...';
    
    const record = `v=DKIM1; k=rsa; p=${mockPublicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g, '')}`;
    
    return {
      privateKey: mockPrivateKey,
      publicKey: mockPublicKey,
      record
    };
  }

  async generateDNSConfig(domain: string): Promise<{
    records: DNSRecord[];
    instructions: string[];
  }> {
    const dkim = this.generateDKIMKey(domain);
    
    const records: DNSRecord[] = [
      {
        type: 'MX',
        name: domain,
        value: 'mail.oxlas.com',
        priority: 10
      },
      {
        type: 'TXT',
        name: domain,
        value: 'v=spf1 include:_spf.oxlas.com ~all'
      },
      {
        type: 'TXT',
        name: 'default._domainkey.' + domain,
        value: dkim.record
      },
      {
        type: 'TXT',
        name: '_dmarc.' + domain,
        value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@oxlas.com'
      },
      {
        type: 'A',
        name: 'mail.' + domain,
        value: '192.168.1.100' // Replace with actual server IP
      }
    ];

    const instructions = [
      '1. Log in to your domain registrar (GoDaddy, Namecheap, etc.)',
      '2. Navigate to DNS management',
      '3. Add the following DNS records:',
      ...records.map(record => 
        `   - ${record.type} record: ${record.name} → ${record.value}${record.priority ? ` (Priority: ${record.priority})` : ''}`
      ),
      '4. Save changes and wait for DNS propagation (may take up to 48 hours)',
      '5. Return to Oxlas and click "Verify Domain"'
    ];

    return { records, instructions };
  }

  async checkPropagation(domain: string): Promise<{ propagated: boolean; progress: number }> {
    try {
      // Check if we can resolve the domain
      const records = await this.resolveDNS(domain, 'A');
      const propagated = records.length > 0;
      
      // Simulate progress based on common propagation patterns
      const progress = propagated ? 100 : Math.min(95, Math.floor(Math.random() * 100));
      
      return { propagated, progress };
    } catch (error) {
      return { propagated: false, progress: 0 };
    }
  }
}